import { Request, Response } from 'express';
import { ExtendedProductSchema } from '../../Models/product.model'
import { globalClient as prisma } from '../../prismaClient';
import { Router } from 'express';
import verifyToken from '../../Middlewares/verifyToken';
import authorize from '../../Middlewares/authorize';
import validate from '../../Middlewares/validate';

const manageProductController = Router();
    
const newProduct = async(req: Request, res: Response) => {
    try {
        const product = await prisma.product.create({ data: req.body });
        res.status(201).json(product);
    }
    catch(e){
        res.status(500).json({error: "Internal Server Error"});
    }
}
manageProductController.post('/', verifyToken, authorize(["ADMIN", "MODERATOR"]), validate(ExtendedProductSchema), newProduct);



const updateProduct = async(req: Request, res: Response) => {
    try{
        const product = await prisma.product.update({ where: { id: req.params.id, deleted: false }, data: req.body });
        res.status(200).json(product);
    }
    catch(e){
        res.status(500).json({error: "Internal Server Error"});
    }
}
manageProductController.put('/:id', verifyToken, authorize(["ADMIN", "MODERATOR"]), validate(ExtendedProductSchema), updateProduct);



const deleteProduct = async(req: Request, res: Response) => {
    try{
        const product = await prisma.product.update({ where: { id: req.params.id }, data: { deleted: true } });
        res.status(204).json(product);
    }
    catch(e){
        res.status(500).json({error: "Internal Server Error"});
    }
}
manageProductController.delete('/:id', verifyToken, authorize(["ADMIN", "MODERATOR"]), deleteProduct);

export default manageProductController;