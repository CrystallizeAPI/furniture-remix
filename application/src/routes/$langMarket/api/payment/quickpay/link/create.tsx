import {
    Cart,
    handleQuickPayCreatePaymentLinkRequestPayload,
    quickPayCreatePaymentLinkPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getContext, validatePayload } from '~/use-cases/http/utils';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { buildLanguageMarketAwareLink } from '~/core/LanguageAndMarket';

export const action: ActionFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
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
                const orderCartLink = buildLanguageMarketAwareLink(
                    `/order/cart/${cartId}`,
                    requestContext.language,
                    requestContext.market,
                );

                return {
                    amount: cart.total.gross * 100, // in cents
                    currency: cart.total.currency,
                    urls: {
                        continue: `${requestContext.baseUrl}${orderCartLink}`,
                        cancel: `${requestContext.baseUrl}${orderCartLink}`,
                        callback: `${requestContext.baseUrl}/api/webhook/payment/quickpay`,
                    },
                };
            },
        },
    );
    return json(data);
};
