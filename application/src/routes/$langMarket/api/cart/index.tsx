import { ActionFunction } from '@remix-run/node';
import { getStoreFront } from '~/core-server/storefront.server';
import { privateJson } from '~/bridge/privateJson.server';
import { handleAndSaveCart, hydrateCart } from '~/core-server/cart.server';
import { getContext } from '~/core-server/http-utils.server';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const cart = await hydrateCart(storefront.apiClient, requestContext.language, body);

    return privateJson(await handleAndSaveCart(cart, body.cartId as string));
};
