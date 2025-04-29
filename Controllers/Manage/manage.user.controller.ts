import { Router, Request, Response } from "express";
import { globalClient as prisma } from "../../prismaClient";
import { ExtendedUserSchema } from "../../Models/user.model";
import verifyToken from "../../Middlewares/verifyToken";
import validateZodSchema from "../../Middlewares/validateZodSchema";
import { z } from "zod";


const manageUserController = Router();

const usersFilterSchema = ExtendedUserSchema.pick({ email: true, phone: true, name: true, role: true, deleted: true }).partial();
type UsersFilter = z.infer<typeof usersFilterSchema>;

const getUsers = async (req: Request, res: Response) => {
    const filter: UsersFilter = req.body;
    const users = await prisma.user.findMany({
        where: {
            ...(filter.email && { email: { contains: filter.email } }),
            ...(filter.phone && { phone: { contains: filter.phone } }),
            ...(filter.name && { name: { contains: filter.name } }),
            ...(filter.role && { role: filter.role }),
            ...(filter.deleted !== undefined && { deleted: filter.deleted }),
        },
        select: { id: true, email: true, emailVerified: true, phone: true, phoneVerified: true, name: true, role: true, deleted: true }
    });
    res.status(200).json(users);
}
manageUserController.get('/', verifyToken(["ADMIN", "MODERATOR"]), validateZodSchema(usersFilterSchema), getUsers);

const addRoleToUser = async (req: Request, res: Response) => {
    const requesterRole = req.params.userRole;

    const id = req.params.id;
    const role = req.body.role;
    if (!role || !id) {
        res.status(400).json({ error: "Role is missing" });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id, deleted: false } });
    if (!user) {
        res.status(400).json({ error: "Invalid user" });
        return;
    }

    if (requesterRole === "MODERATOR" && ["ADMIN", "MODERATOR"].includes(user.role)) {
        res.status(403).json({ error: "Permission denied: Cannot change higher role" });
        return;
    }

    if ((requesterRole === "ADMIN" && role === "ADMIN")
        || (requesterRole === "MODERATOR" || ["ADMIN", "MODERATOR"].includes(role))) {
        res.status(400).json({ error: "Permission denied: Cannot give even or higher role" });
        return;
    }
    res.status(200).json(user);
}
manageUserController.post('/:id', verifyToken(["ADMIN", "MODERATOR"]), addRoleToUser);



export default manageUserController;
