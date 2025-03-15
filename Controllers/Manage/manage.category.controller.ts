import { Request, Response } from 'express';
import { globalClient as prisma } from '../../prismaClient';
import { Router } from 'express';
import verifyToken from '../../Middlewares/verifyToken';
import authorize from '../../Middlewares/authorize';
import validate from '../../Middlewares/validate';
import { ExtendedCategorySchema } from '../../Models/category.model';

const manageCategoryController = Router();

const newCategory = async(req: Request, res: Response) => {
    const exists = await prisma.category.findFirst({ where: { name: req.body.name } });
    if(exists) {
        res.status(400).json({ error: 'Category already exists' });
        return;
    }

    const category = await prisma.category.create({ data: req.body });
    res.status(201).json(category);
}
manageCategoryController.post('/', verifyToken, authorize(["ADMIN", "MODERATOR"]), validate(ExtendedCategorySchema), newCategory);

const updateCategory = async(req: Request, res: Response) => {
    const exists = await prisma.category.findFirst({ where: { name: req.body.name } });
    if(exists) {
        res.status(400).json({ error: 'Category already exists' });
        return;
    }

    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    res.status(200).json(category);
}
manageCategoryController.put('/:id', verifyToken, authorize(["ADMIN", "MODERATOR"]), validate(ExtendedCategorySchema), updateCategory);

const deleteCategory = async(req: Request, res: Response) => {
    if(await prisma.product.findFirst({ where: { categoryId: req.params.id } })) {
        res.status(400).json({ error: 'Category has products, cannot delete' });
        return;
    }

    try {
        await prisma.category.delete({ where: { id: req.params.id } });
        res.status(204);
    }
    catch(e) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
}
manageCategoryController.delete('/:id', verifyToken, authorize(["ADMIN", "MODERATOR"]), deleteCategory);

export default manageCategoryController;
