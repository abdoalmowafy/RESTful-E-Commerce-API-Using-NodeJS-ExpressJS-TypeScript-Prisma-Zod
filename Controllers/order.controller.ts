import verifyToken from "../Middlewares/verifyToken";
import { globalClient as prisma } from "../prismaClient";
import { request, Request, Response, Router } from "express";
import { getValidatedCart } from "./cart.controller";
import { z } from "zod";
import { ExtendedOrderSchema } from "../Models/order.model";
import validateZodSchema from "../Middlewares/validateZodSchema";
import pay from "../Services/paymob.service";

const orderController = Router();
const orderRequestSchema = ExtendedOrderSchema.pick({
    deliveryNeeded: true,
    deliveryAddressId: true,
    paymentMethod: true,
    currency: true,
}).extend({ identifier: z.string().length(11).optional() });
type OrderRequest = z.infer<typeof orderRequestSchema>;

const indexOrders = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const orders = await prisma.order.findMany({ where: { userId: userId }, include: { orderItems: true, deliveryAddress: true } });
    res.status(200).json(orders);
};
orderController.get("/", verifyToken(), indexOrders);

const getValidatedAddress = async function (addressId: string, userId: string, deliveryNeeded: boolean) {
    const deliveryAddress = deliveryNeeded ?
        await prisma.address.findUnique({ where: { id: addressId, storeAddress: true, deleted: false } }) :
        await prisma.address.findUnique({ where: { id: addressId, userId: userId, deleted: false } });

    return deliveryAddress;
}
const isValidCurrency = function (currency: string): boolean {
    return currency === "EGP";
}


const COD_FEE = 1000;
const DELIVERY_FEE = 5000;
const createOrder = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const request: OrderRequest = req.body;
    if (isValidCurrency(request.currency)) {
        res.status(400).json({ error: 'Invalid currency' });
        return;
    }
    if (request.paymentMethod === "MOBILEWALLET" && !request.identifier) {
        res.status(400).json({ error: 'Mobile wallet identifier is required' });
        return;
    }

    const cart = await getValidatedCart(userId);
    if (!cart || cart.cartItems.length === 0) {
        res.status(400).json({ error: 'Add items to cart first' });
        return;
    }

    const deliveryAddress = await getValidatedAddress(request.deliveryAddressId, userId, request.deliveryNeeded);
    if (!deliveryAddress) {
        res.status(400).json({ error: 'Invalid address' });
        return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.emailVerified || !user.phoneVerified) {
        res.status(400).json({ error: 'Invalid user data' });
        return;
    }
    const userName = user.name;
    const userEmail = user.email;
    const userPhone = user.phone!;

    const orderItems = cart!.cartItems.map(ci => ({
        productId: ci.productId,
        productPriceCents: ci.product.priceCents,
        productSalePercent: ci.product.salePercent,
        warrantyDays: ci.product.warrantyDays,
        quantity: ci.quantity,
    }))

    const totalCentsBeforePromo = orderItems.reduce((total, oi) =>
        total + (oi.productPriceCents * oi.quantity * (1 - (oi.productSalePercent / 100))), 0)

    let totalCents = cart!.promoCode ? totalCentsBeforePromo * (1 - (cart!.promoCode.discountPercent / 100)) : totalCentsBeforePromo;

    totalCents += request.deliveryNeeded ? DELIVERY_FEE : 0;
    totalCents += request.paymentMethod === "COD" ? COD_FEE : 0;

    try {
        const orderPromise = prisma.order.create({
            data: {
                userId: userId,
                deliveryAddressId: request.deliveryAddressId,
                promoCodeId: cart!.promoCodeId,
                totalCents: totalCents,
                status: request.paymentMethod === "COD" ? "PROCESSING" : "PAYING",
                orderItems: {
                    createMany: { data: orderItems }
                },
                deliveryNeeded: request.deliveryNeeded,
                paymentMethod: request.paymentMethod,
                currency: request.currency
            }
        });
        const updateProductsPromises = cart!.cartItems.map(ci => prisma.product.update({
            where: { id: ci.productId }, data: { stock: ci.product.stock - ci.quantity }
        }));
        const results = await prisma.$transaction([orderPromise, ...updateProductsPromises]);
        const order = results[0];
        if (order.paymentMethod !== "COD") {
            res.status(200).json({ redirectURL: await pay(userName, userEmail, userPhone, order, orderItems, deliveryAddress, request.identifier) });
            return;
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(400).json({ error: "Error creating order" });
    }
};
orderController.post("/", verifyToken(), validateZodSchema(orderRequestSchema), createOrder);


const cancelOrder = async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const orderId = req.params.orderId;
    if (!orderId) {
        res.status(400).json({ error: "Order id is missing" });
        return;
    }

    const order = await prisma.order.findUnique({ where: { id: orderId, userId: userId } });
    if (!order) {
        res.status(400).json({ error: "Order not found" });
        return;
    }

    if (order.status !== "PROCESSING" && order.status !== "ON_THE_WAY") {
        res.status(400).json({ error: "Order cannot be deleted" });
        return;
    }

    await prisma.order.update({ where: { id: orderId }, data: { deleted: true, deletedAt: new Date(), status: "CANCELLED" } });
    res.status(200).json({ message: "Order deleted" });
};
orderController.delete("/:orderId", verifyToken(), cancelOrder);



