import {
    Cart,
    handleStripeCreatePaymentIntentRequestPayload,
    stripePaymentIntentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getContext, validatePayload } from '~/use-cases/http/utils';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);

    const body = await request.json();
    const data = await handleStripeCreatePaymentIntentRequestPayload(
        validatePayload(body, stripePaymentIntentPayload),
        {
            secret_key: process.env.STRIPE_SECRET_KEY ?? storefront.config?.configuration?.SECRET_KEY ?? '',
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
                return {
                    amount: cart.total.gross * 100, // in cents (not sure here if this is correct)
                    currency: cart.total.currency,
                };
            },
        },
    );
    return json(data);
};
