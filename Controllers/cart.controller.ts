import { Request, Response } from 'express';
import { globalClient as prisma } from '../prismaClient';
import { Router } from 'express';
import verifyToken from '../Middlewares/verifyToken';

const cartController = Router();

const indexCart = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const cart = await prisma.cart.findUnique({ where: { userId: userId }, include: { cartItems: true, promoCode: true } });

    res.status(200).json(cart);
}
cartController.get('/', verifyToken, indexCart);


const modifyCartItems = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const productId = req.body.productId;
    const quantity = req.body.quantity;
    const cart = await prisma.cart.findUnique({ where: { userId: userId }, include: { cartItems: true } });

    if(quantity === 0) {
        try {
            const cartItem = await prisma.cartItem.deleteMany({
            where: {
                productId: productId,
                cartId: cart!.id
                }
            });

            res.status(200).json(cartItem);
            return;
        }
        catch (error) {
            res.status(400).json({ error: 'Cart item not found' });
            return;
        }
    }

    let cartItem = await prisma.cartItem.findFirst({ where: { productId: productId, cartId: cart!.id } });
    if (cartItem) {
        await prisma.cartItem.update({
            where: { id: cartItem.id },
            data: { quantity: quantity }
        });
    }
    else {
        cartItem = await prisma.cartItem.create({
            data: {
                productId: productId,
                quantity: quantity,
                cartId: cart!.id
            }
        });
    }
    
    res.status(200).json(cartItem);
}
cartController.post('/', verifyToken, modifyCartItems);


const modifyPromoCode = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const newPromoCode = req.params.promoCode;
    const cart = await prisma.cart.findUnique({ where: { userId: userId }, include: { promoCode: true } });
    const promoCode = await prisma.promoCode.findFirst({ where: { code: newPromoCode } });

    if (!promoCode) {
        await prisma.cart.update({
            where: { id: cart!.id },
            data: { promoCode: undefined }
        });
    }
    else{
        await prisma.cart.update({
            where: { id: cart!.id },
            data: { promoCodeId: promoCode.id }
        });
    }

    res.status(200).json(promoCode);
}
cartController.post('/promoCode/:promoCode', verifyToken, modifyPromoCode);