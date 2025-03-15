import { Request, Response } from 'express';
import { ExtendedAddressSchema } from '../../Models/address.model';
import { globalClient as prisma } from '../../prismaClient';
import { Router } from 'express';
import verifyToken from '../../Middlewares/verifyToken';
import authorize from '../../Middlewares/authorize';
import validate from '../../Middlewares/validate';

const manageStoreAddressController = Router();

const newStoreAddress = async (req: Request, res: Response) => {
    try {
        const storeAddress = await prisma.address.create({ data: {storeAddress:true , ...req.body }});
        res.status(201).json(storeAddress);
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
manageStoreAddressController.post('/', verifyToken, authorize(["ADMIN", "MODERATOR"]), validate(ExtendedAddressSchema), newStoreAddress);

const updateStoreAddress = async (req: Request, res: Response) => {
    try {
        const storeAddress = await prisma.address.update({ where: { id: req.params.id, deleted: false }, data: {storeAddress:true , ...req.body }});
        res.status(200).json(storeAddress);
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
manageStoreAddressController.put('/:id', verifyToken, authorize(["ADMIN", "MODERATOR"]), validate(ExtendedAddressSchema), updateStoreAddress);

const deleteStoreAddress = async (req: Request, res: Response) => {
    try {
        const storeAddress = await prisma.address.update({ where: { id: req.params.id }, data: { deleted: true } });
        res.status(204).json(storeAddress);
    } catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};
manageStoreAddressController.delete('/:id', verifyToken, authorize(["ADMIN", "MODERATOR"]), deleteStoreAddress);

export default manageStoreAddressController;