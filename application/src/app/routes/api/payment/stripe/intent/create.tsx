import {
    Cart,
    handleStripeCreatePaymentIntentRequestPayload,
    stripePaymentIntentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getHost, validatePayload } from '~/core-server/http-utils.server';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);

    const body = await httpRequest.json();
    const data = handleStripeCreatePaymentIntentRequestPayload(validatePayload(body, stripePaymentIntentPayload), {
        secret_key: storefront.config.configuration.SECRET_KEY,
        fetchCart: async () => {
            const cartId = body.cartId as string;
            const cartWrapper = await cartWrapperRepository.find(cartId);
            if (!cartWrapper) {
                throw {
                    message: `Cart '${cartId}' does not exist.`,
                    status: 404,
                };
            }
            return cartWrapper.cart;
        },
        createIntentArguments: (cart: Cart) => {
            const cartId = body.cartId as string;
            return {
                amount: cart.total.net * 100, // in cents (not sure here if this is correct)
                currency: cart.total.currency,
                metatdata: {
                    cartId,
                },
            };
        },
    });
    return json(data);
};
