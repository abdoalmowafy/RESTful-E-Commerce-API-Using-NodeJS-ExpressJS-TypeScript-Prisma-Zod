import { Router, Request, Response } from "express";
import { globalClient as prisma } from "../../prismaClient";
import verifyToken from "../../Middlewares/verifyToken";
import { z } from "zod";
import validateZodSchema from "../../Middlewares/validateZodSchema";
import { ExtendedOrderSchema } from "../../Models/order.model";

const manageOrderController = Router();
const orderFilterSchema = ExtendedOrderSchema.pick({ userId: true, paymentMethod: true, status: true, deliveryNeeded: true }).partial();
type OrderFilter = z.infer<typeof orderFilterSchema>;

const getOrders = async (req: Request, res: Response) => {
    const requesterId = req.params.userId;
    const userRole = req.params.userRole;
    const request: OrderFilter = req.body;
    const orders = prisma.order.findMany({
        where: {
            ...(userRole === "TRANSPORTER" && { transporterId: requesterId }),
            ...(request.userId && { userId: request.userId }),
            ...(request.paymentMethod && { paymentMethod: request.paymentMethod }),
            ...(request.status && { status: request.status }),
            ...(request.deliveryNeeded !== undefined && { deliveryNeeded: request.deliveryNeeded }),
        },
        include: { orderItems: { include: { product: true } }, deliveryAddress: true, user: true },
    });

    res.json(orders);
};
manageOrderController.get('/', verifyToken(["ADMIN", "MODERATOR", "TRANSPORTER"]), validateZodSchema(orderFilterSchema), getOrders);

const setTransporterToOrder = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const transporterId = req.body.transporterId;

    if (!orderId || !transporterId) {
        res.status(400).json({ error: "Order id or transporter id is missing" });
        return;
    }
    const order = await prisma.order.findUnique({ where: { id: orderId, status: "PROCESSING" } });
    if (!order) {
        res.status(400).json({ error: "Invalid order" });
        return;
    }

    const transporter = await prisma.user.findUnique({ where: { id: transporterId, role: "TRANSPORTER", deleted: false } });
    if (!transporter) {
        res.status(400).json({ error: "Invalid transporter" });
        return;
    }

    const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: { transporterId: transporterId } });
    res.status(200).json(updatedOrder);
};
manageOrderController.put('/:orderId', verifyToken(["ADMIN", "MODERATOR"]), setTransporterToOrder);

const rejectOrder = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    if (!orderId) {
        res.status(400).json({ error: "Order id is missing" });
        return;
    }

    const order = await prisma.order.findUnique({ where: { id: orderId, status: "PROCESSING" } });
    if (!order) {
        res.status(400).json({ error: "Invalid order" });
        return;
    }

    const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: { status: "REJECTED" } });
    res.status(200).json(updatedOrder);
}
manageOrderController.delete('/:orderId', verifyToken(["ADMIN", "MODERATOR"]), rejectOrder);


export default manageOrderController;