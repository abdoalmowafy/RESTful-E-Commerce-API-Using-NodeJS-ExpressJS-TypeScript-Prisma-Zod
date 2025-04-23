import userController from "./user.controller";
import { Request, Response } from "express";
import { globalClient as prisma } from "../prismaClient";
import { ExtendedAddressSchema } from "../Models/address.model";
import { z } from "zod";
import verifyToken from "../Middlewares/verifyToken";
import validateZodSchema from "../Middlewares/validateZodSchema";

const AddressRequestSchema = ExtendedAddressSchema.pick({
    apartment: true,
    floor: true,
    building: true,
    street: true,
    city: true,
    state: true,
    country: true,
    postalCode: true,
})
type AddressRequest = z.infer<typeof AddressRequestSchema>;

const indexAddresses = async (req: Request, res: Response) => {
    const id = req.params.userId;

    try {
        const addresses = await prisma.address.findMany({ where: { userId: id } });
        res.json(addresses);
    } catch (error) {
        res.status(400).json({ error: 'Fetching addresses failed' });
    }
};
userController.get('/account/address', verifyToken(), indexAddresses);

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
userController.post('/account/address', verifyToken(), validateZodSchema(AddressRequestSchema), addAddress);

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
userController.put('/account/address/:addressId', verifyToken(), validateZodSchema(AddressRequestSchema), updateAddress);

const deleteAddress = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { addressId } = req.params;
    if (addressId === undefined) {
        res.status(400).json({ error: 'Address id is required' });
        return;
    }

    try {
        await prisma.address.delete({ where: { id: addressId, userId } });
        res.status(204).json({ message: 'address deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Deleting address failed' });
    }
};
userController.delete('/account/address/:addressId', verifyToken(), deleteAddress);


