import { ClientInterface } from '@crystallize/js-api-client';
import { hydrateCart } from '../crystallize/write/editCart';

type Deps = {
    apiClient: ClientInterface;
};

export default async (body: any, { apiClient }: Deps, markets?: string[]) => {
    const cartId = body?.cartId;

    const localCartItems = body?.items?.map((item: any) => ({
        sku: item.sku,
        quantity: item.quantity,
    }));

    const voucher = body.extra?.voucher?.toUpperCase() || '';

    try {
        return await hydrateCart(localCartItems, { apiClient }, cartId, markets, voucher);
    } catch (error: any) {
        if (error.message.includes('placed')) {
            console.log('Cart has been placed, creating a new one');
            return await hydrateCart(localCartItems, { apiClient }, undefined, markets, voucher);
        }
        throw error;
    }
};
