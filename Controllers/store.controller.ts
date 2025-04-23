import { Request, Response } from 'express';
import { globalClient as prisma } from '../prismaClient';
import { Router } from "express";
import verifyToken from '../Middlewares/verifyToken';

const storeController = Router();

const home = async (req: Request, res: Response) => {
    res.status(200).json({
        products: await prisma.product.findMany({ select: { id: true, name: true, priceCents: true, salePercent: true, categoryId: true, category: { select: { name: true } } }, where: { deleted: false } }),
    });
}
storeController.get('/', home);

const getCategories = async (req: Request, res: Response) => {
    res.status(200).json({
        categories: await prisma.category.findMany()
    });
}
storeController.get('/category', getCategories);

const getStoreAddresses = async (req: Request, res: Response) => {
    res.status(200).json({
        storeAddress: await prisma.address.findMany({ where: { storeAddress: true, deleted: false } })
    });
}
storeController.get('/storeAddress', getStoreAddresses);


const expandProduct = async (req: Request, res: Response) => {
    const productId = req.params.id;
    if (!productId) {
        res.status(400).json({ error: "Product id is required" });
        return;
    }

    const product: any = await prisma.product.findFirst({
        where: { id: productId, deleted: false },
        select: { id: true, name: true, sku: true, description: true, views: true, stock: true, priceCents: true, salePercent: true, warrantyDays: true, category: { select: { name: true } } }
    });

    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return;
    }
    const views = product.views;
    delete product.views;

    await prisma.product.update({ where: { id: productId }, data: { views: views + 1 } });

    res.status(200).json({ product: product });
}
storeController.get('/:id', expandProduct);

const indexWishlist = async (req: Request, res: Response) => {
    const userId = req.params.userId;

    const wishlist = await prisma.user.findFirst({
        where: { id: userId },
        select: { wishlist: { select: { id: true, name: true, priceCents: true, salePercent: true, categoryId: true, category: { select: { name: true } } } } }
    });
    res.status(200).json({ wishlist });
}
storeController.get('/wishlist', verifyToken(), indexWishlist);


const addWishlist = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    if (!productId) {
        res.status(400).json({ error: "Product id is required" });
        return;
    }

    const product = prisma.product.findFirst({ where: { id: productId, deleted: false } });
    if (!product) {
        res.status(404).json({ error: "product not found" });
        return;
    }

    try {
        await prisma.user.update({ where: { id: userId }, data: { wishlist: { connect: { id: productId } } } });
        res.status(200).json({ message: "product added to wishlist" });
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
storeController.post('/wishlist:id', verifyToken(), addWishlist);


const removeWishlist = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const productId = req.params.productId;
    if (!productId) {
        res.status(400).json({ error: "Product id is required" });
        return;
    }

    const product = prisma.product.findFirst({ where: { id: productId, deleted: false } });
    if (!product) {
        res.status(404).json({ error: "product not found" });
        return;
    }

    try {
        await prisma.user.update({ where: { id: userId }, data: { wishlist: { disconnect: { id: productId } } } });
        res.status(200).json({ message: "product removed from wishlist" });
    }
    catch (e) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
storeController.delete('/wishlist:id', verifyToken(), removeWishlist);


export default storeController;