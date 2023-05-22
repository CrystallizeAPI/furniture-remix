import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    Cart,
    CartWrapper,
    handleStripeCreatePaymentIntentRequestPayload,
    stripePaymentIntentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { RequestContext, validatePayload } from '../../http/utils';

export default async (
    cartWrapper: CartWrapper,
    context: RequestContext,
    payload: unknown,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleStripeCreatePaymentIntentRequestPayload(validatePayload(payload, stripePaymentIntentPayload), {
        secret_key: process.env.STRIPE_SECRET_KEY ?? storeFrontConfig?.configuration?.STRIPE_SECRET_KEY ?? '',
        fetchCart: async () => {
            return cartWrapper.cart;
        },
        createIntentArguments: (cart: Cart) => {
            return {
                amount: cart.total.gross * 100, // in cents (not sure here if this is correct)
                currency: cart.total.currency,
            };
        },
    });
};
