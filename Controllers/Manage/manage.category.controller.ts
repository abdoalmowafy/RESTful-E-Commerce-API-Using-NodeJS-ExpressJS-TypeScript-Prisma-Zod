import { Request, Response } from 'express';
import { globalClient as prisma } from '../../prismaClient';
import { Router } from 'express';
import verifyToken from '../../Middlewares/verifyToken';

const manageCategoryController = Router();

const newCategory = async (req: Request, res: Response) => {
    const categoryName = req.body.name.trim();
    if (!categoryName || categoryName.length < 3) {
        res.status(400).json({ error: 'Category name too short' });
        return;
    }

    const exists = await prisma.category.findFirst({ where: { name: categoryName } });
    if (exists) {
        res.status(400).json({ error: 'Category already exists' });
        return;
    }

    const category = await prisma.category.create({ data: { name: categoryName } });
    res.status(201).json(category);
}
manageCategoryController.post('/', verifyToken(["ADMIN", "MODERATOR"]), newCategory);

const deleteCategory = async (req: Request, res: Response) => {
    const categoryId = req.params.id;
    if (await prisma.product.findFirst({ where: { categoryId } })) {
        res.status(400).json({ error: 'Category has products, cannot delete' });
        return;
    }

    try {
        await prisma.category.delete({ where: { id: categoryId } });
        res.status(204);
    }
    catch (e) {
        res.status(404).json({ error: 'Category not found' });
        return;
    }
}
manageCategoryController.delete('/:id', verifyToken(["ADMIN", "MODERATOR"]), deleteCategory);

export default manageCategoryController;
