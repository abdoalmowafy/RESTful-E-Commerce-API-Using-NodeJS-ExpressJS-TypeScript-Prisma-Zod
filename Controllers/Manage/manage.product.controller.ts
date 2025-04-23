import { Request, Response } from 'express';
import { ExtendedProductSchema } from '../../Models/product.model'
import { globalClient as prisma } from '../../prismaClient';
import { Router } from 'express';
import verifyToken from '../../Middlewares/verifyToken';
import validateZodSchema from '../../Middlewares/validateZodSchema';
import { z } from 'zod';

const manageProductController = Router();
const productRequestSchema = ExtendedProductSchema.omit({ id: true, createdAt: true, updatedAt: true, views: true, deleted: true });
type ProductRequest = z.infer<typeof productRequestSchema>;

const newProduct = async (req: Request, res: Response) => {
    const request: ProductRequest = req.body;
    try {
        const product = await prisma.product.create({ data: request });
        res.status(201).json(product);
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
manageProductController.post('/', verifyToken(["ADMIN", "MODERATOR"]), validateZodSchema(productRequestSchema), newProduct);



const updateProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const request: ProductRequest = req.body;
    try {
        const product = await prisma.product.update({ where: { id: productId, deleted: false }, data: request });
        res.status(200).json(product);
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
manageProductController.put('/:id', verifyToken(["ADMIN", "MODERATOR"]), validateZodSchema(ExtendedProductSchema.omit({ id: true })), updateProduct);



const deleteProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    try {
        const product = await prisma.product.update({ where: { id: productId }, data: { deleted: true } });
        res.status(204).json(product);
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
manageProductController.delete('/:id', verifyToken(["ADMIN", "MODERATOR"]), deleteProduct);

export default manageProductController;