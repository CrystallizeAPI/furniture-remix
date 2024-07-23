import { ClientInterface } from '@crystallize/js-api-client';
import { fetchCart } from '../crystallize/read/fetchCart';
import { hydrateCart } from '../crystallize/write/editCart';

type Deps = {
    apiClient: ClientInterface;
};

export default async (body: any, { apiClient }: Deps, markets?: string[]) => {
    const cartId = body?.cartId;
    const cart = cartId ? await fetchCart(cartId, { apiClient }) : undefined;

    const localCartItems = body?.items?.map((item: any) => ({
        sku: item.sku,
        quantity: item.quantity,
    }));

    if (cartId) {
        return await hydrateCart(localCartItems, { apiClient }, cartId, markets);
    }

    if (!cartId || cart?.state === 'placed') {
        return await hydrateCart(localCartItems, { apiClient }, '', markets);
    }
};
