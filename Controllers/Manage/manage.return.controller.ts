import { Router, Request, Response } from "express";
import { globalClient as prisma } from "../../prismaClient";
import verifyToken from "../../Middlewares/verifyToken";
import { z } from "zod";
import validateZodSchema from "../../Middlewares/validateZodSchema";
import { ExtendedReturnSchema } from "../../Models/return.model";

const manageReturnController = Router();
const returnFilterSchema = ExtendedReturnSchema.pick({ userId: true, status: true, deliveryNeeded: true }).partial();
type ReturnFilter = z.infer<typeof returnFilterSchema>;

const getReturns = async (req: Request, res: Response) => {
    const requesterId = req.params.userId;
    const userRole = req.params.userRole;
    const request: ReturnFilter = req.body;
    const returns = prisma.return.findMany({
        where: {
            ...(userRole === "TRANSPORTER" && { transporterId: requesterId }),
            ...(request.userId && { userId: request.userId }),
            ...(request.status && { status: request.status }),
            ...(request.deliveryNeeded !== undefined && { deliveryNeeded: request.deliveryNeeded }),
        },
        include: { orderItem: { include: { product: true } }, returnAddress: true, user: true },
    });

    res.json(returns);
};
manageReturnController.get('/', verifyToken(["ADMIN", "MODERATOR", "TRANSPORTER"]), validateZodSchema(returnFilterSchema), getReturns);

const setTransporterToReturn = async (req: Request, res: Response) => {
    const returnId = req.params.returnId;
    const transporterId = req.body.transporterId;

    if (!returnId || !transporterId) {
        res.status(400).json({ error: "Return id or transporter id is missing" });
        return;
    }
    const returnn = await prisma.return.findUnique({ where: { id: returnId, status: "PROCESSING" } });
    if (!returnn) {
        res.status(400).json({ error: "Invalid return" });
        return;
    }

    const transporter = await prisma.user.findUnique({ where: { id: transporterId, role: "TRANSPORTER", deleted: false } });
    if (!transporter) {
        res.status(400).json({ error: "Invalid transporter" });
        return;
    }

    const updatedReturn = await prisma.return.update({ where: { id: returnId }, data: { transporterId: transporterId } });
    res.status(200).json(updatedReturn);
};
manageReturnController.put('/:returnId', verifyToken(["ADMIN", "MODERATOR"]), setTransporterToReturn);

const rejectReturn = async (req: Request, res: Response) => {
    const returnId = req.params.returnId;
    if (!returnId) {
        res.status(400).json({ error: "Return id is missing" });
        return;
    }

    const returnn = await prisma.return.findUnique({ where: { id: returnId, status: "PROCESSING" } });
    if (!returnn) {
        res.status(400).json({ error: "Invalid return" });
        return;
    }

    const updatedReturn = await prisma.return.update({ where: { id: returnId }, data: { status: "REJECTED" } });
    res.status(200).json(updatedReturn);
}
manageReturnController.delete('/:returnId', verifyToken(["ADMIN", "MODERATOR"]), rejectReturn);


export default manageReturnController;