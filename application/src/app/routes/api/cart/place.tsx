import { createProductHydrater } from '@crystallize/js-api-client';
import { cartPayload, CartPayload, handleCartRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { ActionFunction } from '@remix-run/node';
import { authenticate, isAuthenticated as isServerSideAuthenticated } from '~/core-server/authentication.server';
import { handleAndPlaceCart } from '~/core-server/cart.server';
import { getHost, validatePayload } from '~/core-server/http-utils.server';
import { privateJson } from '~/core-server/privateJson.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);
    const isAuthenticated = await isServerSideAuthenticated(httpRequest);
    const authUser = isAuthenticated ? (await authenticate(httpRequest))?.user : null;
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
    const customerIdentifier = authUser?.aud || body.customer?.email || 'unknow@unknow.com';
    const customer = {
        ...body.customer,
        // we enforce those 3 values from the Authentication, it might not be overridden in the Form
        email: body.customer?.email || authUser?.aud || 'unknow@unknow.com',
        firstname: body.customer?.firstname || authUser.firstname,
        lastname: body.customer?.lastname || authUser.lastname,
        // then we decide of and customerIdentifier
        customerIdentifier,
        isGuest: !isAuthenticated,
    };
    return privateJson(await handleAndPlaceCart(cart, customer, body.cartId as string));
};
