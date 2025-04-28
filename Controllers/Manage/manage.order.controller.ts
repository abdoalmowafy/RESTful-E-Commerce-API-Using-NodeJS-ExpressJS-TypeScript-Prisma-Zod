import { Router } from "express";
import { globalClient as prisma } from "../../prismaClient";
import { Request, Response } from "express";
import verifyToken from "../../Middlewares/verifyToken";
import { z } from "zod";
import validateZodSchema from "../../Middlewares/validateZodSchema";
import { ExtendedOrderSchema } from "../../Models/order.model";

const manageOrderController = Router();
const orderFilterSchema = ExtendedOrderSchema.pick({ userId: true, paymentMethod: true, status: true, deliveryNeeded: true }).partial();
type OrderFilter = z.infer<typeof orderFilterSchema>;

const getOrders = async (req: Request, res: Response) => {
    const request: OrderFilter = req.body;
    const orders = prisma.order.findMany({
        where: {
            ...(request.userId && { userId: request.userId }),
            ...(request.paymentMethod && { paymentMethod: request.paymentMethod }),
            ...(request.status && { status: request.status }),
            ...(request.deliveryNeeded && { deliveryNeeded: request.deliveryNeeded }),
        },
        include: { orderItems: true, deliveryAddress: true }
    });

    res.json(orders);
};
manageOrderController.get('/orders', verifyToken(["ADMIN", "MODERATOR"]), validateZodSchema(orderFilterSchema), getOrders);

const getTransporters = async (req: Request, res: Response) => {
    const transporters = await prisma.user.findMany({ where: { role: "TRANSPORTER", deleted: false } });
    res.status(200).json(transporters);
};
manageOrderController.get('/transporters', verifyToken(["ADMIN", "MODERATOR"]), getTransporters);

const setTransporterToOrder = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const transporterId = req.body.transporterId;

    if (!orderId || !transporterId) {
        res.status(400).json({ error: "Order id or transporter id is missing" });
        return;
    }
    const order = await prisma.order.findUnique({ where: { id: orderId, status: "PROCESSING" } });
    if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
    }

    const transporter = await prisma.user.findUnique({ where: { id: transporterId, role: "TRANSPORTER", deleted: false } });
    if (!transporter) {
        res.status(404).json({ error: "Transporter not found" });
        return;
    }

    const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: { transporterId: transporterId } });
    res.status(200).json(updatedOrder);
};
manageOrderController.put('/orders/:orderId', verifyToken(["ADMIN", "MODERATOR"]), setTransporterToOrder);

const rejectOrder = async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    if (!orderId) {
        res.status(400).json({ error: "Order id is missing" });
        return;
    }

    const order = await prisma.order.findUnique({ where: { id: orderId, status: "PROCESSING" } });
    if (!order) {
        res.status(404).json({ error: "Order not found" });
        return;
    }

    const updatedOrder = await prisma.order.update({ where: { id: orderId }, data: { status: "REJECTED", deleted: true, deletedAt: new Date() } });
    res.status(200).json(updatedOrder);
}
manageOrderController.delete('/orders/:orderId', verifyToken(["ADMIN", "MODERATOR"]), rejectOrder);


export default manageOrderController;