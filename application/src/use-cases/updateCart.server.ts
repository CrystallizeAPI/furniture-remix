import { ClientInterface, addSkuItem, removeCartItem } from '@crystallize/js-api-client';
import { fetchCart } from './crystallize/read/fetchCart';
import { hydrateCart } from './crystallize/write/editCart';

type Deps = {
    apiClient: ClientInterface;
};

export const updateCart = async (cartId: string, sku: string, quantity: number, { apiClient }: Deps) => {
    const cart = cartId ? await fetchCart(cartId, { apiClient }) : undefined;
    // we actually create a new cart here if this one is placed
    if (!cart || cart?.state === 'placed') {
        const hydratedCart = await hydrateCart([{ sku, quantity }], {
            apiClient,
        });
        return hydratedCart?.id;
    }

    if (cart) {
        return cart.id;
    }
    return cart;
};
