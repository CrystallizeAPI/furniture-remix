import { addSkuItem, ClientInterface, removeCartItem } from '@crystallize/js-api-client';
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

    if (!cart || cart?.state === 'placed') {
        return await hydrateCart(localCartItems, { apiClient }, '', markets);
    } else {
        const remoteCartItems = cart.items.map((item) => ({
            sku: item.variant.sku,
            quantity: item.quantity,
        }));

        // compare local and remote cart
        for (const localItem of localCartItems) {
            const remoteItem = remoteCartItems.find((item) => item.sku === localItem.sku);

            if (!remoteItem) {
                // item new in local cart, add
                await addSkuItem(cartId, localItem.sku, localItem.quantity, {
                    apiClient,
                });
            } else if (localItem.quantity !== remoteItem.quantity) {
                // item quantity changed, update
                const quantityDiff = localItem.quantity - remoteItem.quantity;
                if (quantityDiff > 0) {
                    await addSkuItem(cartId, localItem.sku, quantityDiff, {
                        apiClient,
                    });
                } else {
                    await removeCartItem(cartId, localItem.sku, Math.abs(quantityDiff), { apiClient });
                }
            }
        }

        // check and remove items in remote cart that are not in local cart
        for (const remoteItem of remoteCartItems) {
            const localItem = localCartItems.find((item: any) => item.sku === remoteItem.sku);
            if (!localItem) {
                await removeCartItem(cartId, remoteItem.sku, remoteItem.quantity, { apiClient });
            }
        }
        return await fetchCart(cartId, { apiClient });
    }
};
