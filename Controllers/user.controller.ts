import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { globalClient as prisma } from '../prismaClient';
import { Router } from "express";
import verifyToken from '../Middlewares/verifyToken';
import { ExtendedUserSchema } from '../Models/user.model';
import { z } from 'zod';
import validateZodSchema from '../Middlewares/validateZodSchema';

const userController = Router();

const userRegisterSchema = ExtendedUserSchema.pick({ email: true, name: true, dob: true, gender: true }).extend({ password: z.string().length(8) });
type UserRegisterRequest = z.infer<typeof userRegisterSchema>;

const userLoginSchema = userRegisterSchema.pick({ email: true, password: true });
type UserLoginRequest = z.infer<typeof userLoginSchema>;

const userUpdateSchema = userRegisterSchema.pick({ name: true, dob: true, gender: true });
type UserUpdateRequest = z.infer<typeof userUpdateSchema>;

const register = async (req: Request, res: Response) => {
    const request: UserRegisterRequest = req.body;
    const hashedPassword = await bcrypt.hash(request.password, 10);

    try {
        if (await prisma.user.findUnique({ where: { email: request.email } })) {
            res.status(400).json({ error: 'Email already exists' });
            return;
        }

        const cart = await prisma.cart.create({ data: {} });
        const user = await prisma.user.create({
            data: {
                email: request.email,
                passwordHash: hashedPassword,
                name: request.name,
                dob: new Date(request.dob),
                gender: request.gender,
                cartId: cart.id
            }
        });

        res.status(201).json({ userId: user.id });
    } catch (error: any) {
        res.status(400).json({ error: 'User registration failed', message: error.message });
    }
};
userController.post('/register', validateZodSchema(userRegisterSchema), register);

const login = async (req: Request, res: Response) => {
    if (req.headers["authorization"]) {
        res.status(400).json({ error: 'Already logged in' });
        return;
    }

    const request: UserLoginRequest = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: request.email,
                emailVerified: true,
                deleted: false
            }
        });


        if (user && await bcrypt.compare(request.password, user.passwordHash)) {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
                throw new Error('Internal Server Error: API key not configured');
            }

            const token = jwt.sign({ userId: user.id, userRole: user.role, userEmail: user.email, userName: user.name, userPhone: user.phone }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
};
userController.post('/login', validateZodSchema(userLoginSchema), login);


const changePassword = async (req: Request, res: Response) => {
    const { newPassword } = req.body;
    const userId = req.params.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    try {
        const user = await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: hashedPassword }
        });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Password change failed' });
    }
};
userController.post('/account/changePassword', verifyToken(), changePassword);

const userInfo = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.status(200).json({
        id: userId,
        email: user.email,
        name: user.name,
        dob: user.dob,
    });
}
userController.get('/account/info', verifyToken(), userInfo);


const updateUser = async (req: Request, res: Response) => {
    const request: UserUpdateRequest = req.body;
    const userId = req.params.userId;
    const userName = req.params.userName;

    try {
        const newUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: request.name,
                dob: request.dob,
                gender: request.gender,
            }
        });

        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({ error: 'User update failed' });
    }
};
userController.post('/account/info', verifyToken(), validateZodSchema(userUpdateSchema), updateUser);

const verifyMail = async (req: Request, res: Response) => {
    const id = req.params.userId;

    try {
        const updated = await prisma.user.update({
            where: { id },
            data: { emailVerified: true }
        });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Email verification failed' });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        await prisma.user.update({ where: { id: userId }, data: { deleted: true, deletedAt: new Date() } });
        res.status(204).json({ message: 'user deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'User deletion failed' });
    }
};
userController.delete('/account/info', verifyToken(), deleteUser);


export default userController;
