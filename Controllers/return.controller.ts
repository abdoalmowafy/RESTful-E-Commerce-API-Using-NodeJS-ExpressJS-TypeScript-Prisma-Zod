import { Router, Request, Response } from "express";
import { globalClient as prisma } from "../prismaClient";
import { z } from "zod";
import verifyToken from "../Middlewares/verifyToken";
import validateZodSchema from "../Middlewares/validateZodSchema";
import { getValidatedAddress } from "./order.controller";

const returnController = Router();

const returnRequestSchema = z.object({
    orderId: z.string().uuid(),
    productId: z.string().uuid(),
    returnAddressId: z.string().uuid(),
    deliveryNeeded: z.boolean(),
    reason: z.string().min(10),
    quantity: z.number().int().min(1),
});
type ReturnRequest = z.infer<typeof returnRequestSchema>;

const indexReturns = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const returns = await prisma.return.findMany({ where: { userId } });
    res.status(200).json(returns);
};
returnController.get("/", verifyToken(), indexReturns);

const addReturn = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const request: ReturnRequest = req.body;

    const orderItem = await prisma.orderItem.findUnique({
        include: { order: true },
        where: {
            orderId_productId: { orderId: request.orderId, productId: request.productId },
            order: { userId: userId, deleted: false, status: "DELIVERED" },
        }
    });
    if (!orderItem) {
        res.status(400).json({ error: "Invalid order item" });
        return;
    }
    const returnedQuantity = (await prisma.return.findMany({ where: { orderId: request.orderId, deleted: false } })).reduce((acc, curr) => acc + curr.quantity, 0);
    if (orderItem.quantity + returnedQuantity < request.quantity) {
        res.status(400).json({ error: "Invalid quantity" });
        return;
    }

    const deliveryAddress = await getValidatedAddress(request.returnAddressId, userId, request.deliveryNeeded);
    if (!deliveryAddress) {
        res.status(400).json({ error: "Invalid address" });
        return;
    }

    try {
        const newReturn = await prisma.return.create({
            data: {
                userId,
                reason: request.reason,
                quantity: request.quantity,
                orderId: request.orderId,
                productId: request.productId,
                returnAddressId: request.returnAddressId,
                deliveryNeeded: request.deliveryNeeded,
            }
        });
        res.status(201).json(newReturn);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
returnController.post("/", verifyToken(), validateZodSchema(returnRequestSchema), addReturn);

const cancelReturn = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const returnId = req.params.returnId;
    try {
        const deletedReturn = await prisma.return.update({
            where: { id: returnId, userId: userId, status: { in: ["PROCESSING", "ON_THE_WAY"] } },
            data: { status: "CANCELLED", deleted: true, deletedAt: new Date() }
        });
        res.status(200).json({ message: "Return cancelled successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
returnController.delete("/:returnId", verifyToken(), cancelReturn);


export default returnController;