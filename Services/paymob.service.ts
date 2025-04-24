import { ExtendedAddress } from '../Models/address.model';
import { OrderItem } from '../Models/generated/zod';
import { ExtendedOrder } from '../Models/order.model';

const baseUrl = 'https://accept.paymob.com/api/';
const apiKey = process.env.PAYMOB_API_KEY!;
const integrationId = parseInt(process.env.PAYMOB_INTEGRATION_ID!);
const iframe1Id = process.env.PAYMOB_IFRAME1_ID!;

async function post<T = any>(url: string, data: unknown): Promise<T> {
    const response = await fetch(baseUrl + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}

async function authenticate(): Promise<string> {
    const data = await post<{ token: string }>('auth/tokens', {
        api_key: apiKey,
    });
    return data.token;
}

async function registerOrder(order: ExtendedOrder, orderItems: Omit<OrderItem, "orderId">[], authToken: string): Promise<number> {
    if (!order) throw new Error('Order is missing!');

    const items = orderItems.map((op) => ({
        amount_cents: op.productPriceCents * (1 - op.productSalePercent / 100),
        quantity: op.quantity,
    }));

    const orderRequest = {
        auth_token: authToken,
        delivery_needed: order.deliveryNeeded,
        amount_cents: order.totalCents,
        currency: order.currency,
        items,
    };

    const response = await post<{ id: number }>('ecommerce/orders', orderRequest);
    return response.id;
}

async function requestPaymentKey(userName: string, userEmail: string, userPhone: string, order: ExtendedOrder, address: ExtendedAddress, orderId: number, authToken: string): Promise<string> {
    if (!order) throw new Error('Order is missing!');

    const billingData = {
        apartment: address.apartment,
        email: userEmail,
        floor: address.floor,
        first_name: userName.split(' ')[0],
        street: address.street,
        building: address.building,
        phone_number: userPhone,
        shipping_method: 'PKG',
        postal_code: address.postalCode,
        city: address.city,
        country: address.country,
        last_name: userName.split(' ').slice(-1)[0],
        state: address.state,
    };

    const paymentKeyRequest = {
        auth_token: authToken,
        amount_cents: order.totalCents,
        expiration: 3600,
        order_id: orderId,
        billing_data: billingData,
        currency: order.currency,
        integration_id: integrationId,
    };

    const response = await post<{ token: string }>('acceptance/payment_keys', paymentKeyRequest);
    return response.token;
}

async function payMobileWallet(paymentKey: string, identifier: string): Promise<string> {
    const request = {
        source: {
            identifier,
            subtype: 'WALLET',
        },
        payment_token: paymentKey,
    };

    const response = await post<{ redirection_url: string }>('acceptance/payments/pay', request);
    return response.redirection_url;
}

const pay = async (userName: string, userEmail: string, userPhone: string, order: ExtendedOrder, orderItems: Omit<OrderItem, "orderId">[], deliveryAddress: ExtendedAddress, identifier?: string): Promise<string> => {
    if (!order) throw new Error('Order is missing!');
    if (order.paymentMethod === "MOBILEWALLET" && !identifier) throw new Error('Identifier is missing!');

    const authToken = await authenticate();
    const orderId = await registerOrder(order, orderItems, authToken);
    const paymentKey = await requestPaymentKey(userName, userEmail, userPhone, order, deliveryAddress, orderId, authToken);

    switch (order.paymentMethod) {
        case 'COD':
            throw new Error('Invalid method!');
        case 'CREDITCARD':
            return `https://accept.paymobsolutions.com/api/acceptance/iframes/${iframe1Id}?payment_token=${paymentKey}`;
        case 'MOBILEWALLET':
            if (!identifier) throw new Error('Identifier is missing!');
            return await payMobileWallet(paymentKey, identifier);
        default:
            throw new Error('Not implemented');
    }
}

export default pay;
