import {
    Cart,
    handleQuickPayCreatePaymentLinkRequestPayload,
    quickPayCreatePaymentLinkPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getHost, isSecure, validatePayload } from '~/core-server/http-utils.server';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const baseUrl = `${isSecure(httpRequest) ? 'https' : 'http'}://${host}`;
    const { secret: storefront } = await getStoreFront(host);
    const body = await httpRequest.json();
    const data = await handleQuickPayCreatePaymentLinkRequestPayload(
        validatePayload(body, quickPayCreatePaymentLinkPayload),
        {
            api_key: process.env.QUICKPAY_API_KEY ?? storefront.config?.configuration?.QUICKPAY_API_KEY ?? '',
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
            createPaymentArguments: (cart: Cart) => {
                const cartId = body.cartId as string;
                return {
                    amount: cart.total.net * 100, // in cents
                    currency: cart.total.currency,
                    urls: {
                        continue: `${baseUrl}/order/cart/${cartId}`,
                        cancel: `${baseUrl}/order/cart/${cartId}`,
                        callback: `${baseUrl}/api/webhook/payment/quickpay`,
                    },
                };
            },
        },
    );
    return json(data);
};
