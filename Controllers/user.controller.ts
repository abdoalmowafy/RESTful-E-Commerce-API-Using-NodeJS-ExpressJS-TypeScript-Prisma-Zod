import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { GenderType, User, Address } from '../Models/generated/zod';
import { globalClient as prisma } from '../prismaClient';
import { Router } from "express";
import verifyToken from '../Middlewares/verifyToken';

const userController = Router();

type UserRegisterRequest = {
    email: string
    password: string
    name: string    
    dob: Date
    gender: GenderType
}

type UserLoginRequest = {
    email: string
    password: string
}

type UserUpdateRequest = {
    name: string    
    dob: Date
    gender: GenderType
    phone: string
}
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
userController.post('/register', register);

const login = async (req: Request, res: Response) => {
    if(req.headers["authorization"]) {
        res.status(400).json({ error: 'Already logged in' });
        return;
    }

    const request: UserLoginRequest = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { 
            email: request.email,
            emailVerified: true,
            deleted: false
        } });

        
        if (user && await bcrypt.compare(request.password, user.passwordHash)) {
            const JWT_SECRET = process.env.JWT_SECRET;
            if (!JWT_SECRET) {
                throw new Error('Internal Server Error: API key not configured');
            }

            const token = jwt.sign({ userId: user.id, userRole: user.role }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Login failed' });
    }
};
userController.post('/login', login);


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
userController.post('/account/changePassword', verifyToken, changePassword);

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
userController.get('/account/info', verifyToken, userInfo);


const updateUser = async (req: Request, res: Response) => {
    const request: UserUpdateRequest = req.body;
    const userId = req.params.userId;
    
    try {
        const newUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: request.name,
                dob: request.dob,
                gender: request.gender,
                phone: request.phone
            }
        });
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({ error: 'User update failed' });
    }
};
userController.post('/account/info', verifyToken, updateUser);

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
    const user: User = req.body.user;
    try {
        await prisma.user.update({ where: { id: user.id }, data: { deleted: true, deletedAt: new Date() } });
        res.status(204).json({ message: 'user deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'User deletion failed' });
    }
};
userController.delete('/account/info', verifyToken, deleteUser);


type AddressRequest = Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'deleted' | 'deletedAt'>;



const indexAddresses = async (req: Request, res: Response) => {
    const id = req.params.userId;

    try {
        const addresses = await prisma.address.findMany({ where: { userId: id } });
        res.json(addresses);
    } catch (error) {
        res.status(400).json({ error: 'Fetching addresses failed' });
    }
};
userController.get('/account/address', verifyToken, indexAddresses);

const addAddress = async (req: Request, res: Response) => {
    const address: AddressRequest = req.body;
    const id = req.params.userId;
    try {
        const newAddress = await prisma.address.create({
            data: {
                userId: id,
                ...address
            }
        });
        res.status(201).json(newAddress);
    } catch (error) {
        res.status(400).json({ error: 'Adding address failed' });
    }
};
userController.post('/account/address', verifyToken, addAddress);

const updateAddress = async (req: Request, res: Response) => {
    const { addressId } = req.params;
    const address: AddressRequest = req.body;
    const userId = req.params.userId;
    
    try {
        const updatedAddress = await prisma.address.update({
            where: { 
                id: addressId,
                userId: userId
             },
            data: { ...address }
        });
        res.json(updatedAddress);
    } catch (error) {
        res.status(400).json({ error: 'Updating address failed' });
    }
};
userController.put('/account/address/:addressId', verifyToken, updateAddress);

const deleteAddress = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { addressId } = req.params;
    try {
        await prisma.address.delete({ where: { id: addressId, userId } });
        res.status(204).json({ message: 'address deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Deleting address failed' });
    }
};
userController.delete('/account/address/:addressId', verifyToken, deleteAddress);


export default userController;
