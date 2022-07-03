import { createProductHydrater } from '@crystallize/js-api-client';
import { cartPayload, CartPayload, handleCartRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { ActionFunction } from '@remix-run/node';
import { handleAndPlaceCart } from '~/core-server/cart.server';
import { getHost, validatePayload } from '~/core-server/http-utils.server';
import { privateJson } from '~/core-server/privateJson.server';
import { getStoreFront } from '~/core-server/storefront.server';

//@todo: auth
export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);
    const body = await httpRequest.json();
    const cart = await handleCartRequestPayload(validatePayload<CartPayload>(body, cartPayload), {
        hydraterBySkus: createProductHydrater(storefront.apiClient).bySkus,
        perVariant: () => {
            return {
                firstImage: {
                    url: true,
                },
            };
        },
    });
    const customer = {
        identifier: `fake@something.todo`,
    };
    return privateJson(await handleAndPlaceCart(cart, customer, body.cartId as string));
};
