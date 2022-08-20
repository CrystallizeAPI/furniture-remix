import { ActionFunction } from '@remix-run/node';
import { getStoreFront } from '~/core-server/storefront.server';
import { privateJson } from '~/core-server/privateJson.server';
import { handleAndSaveCart, hydrateCart } from '~/core-server/cart.server';
import { getHost } from '~/core-server/http-utils.server';

export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);
    const body = await httpRequest.json();
    const cart = await hydrateCart(storefront.apiClient, body);

    return privateJson(await handleAndSaveCart(cart, body.cartId as string));
};
