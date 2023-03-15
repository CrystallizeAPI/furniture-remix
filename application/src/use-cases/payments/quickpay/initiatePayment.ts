import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    Cart,
    CartWrapper,
    handleQuickPayCreatePaymentLinkRequestPayload,
    quickPayCreatePaymentLinkPayload,
} from '@crystallize/node-service-api-request-handlers';
import { RequestContext, validatePayload } from '../../http/utils';
import { buildLanguageMarketAwareLink } from '../../LanguageAndMarket';

export default async (
    cartWrapper: CartWrapper,
    context: RequestContext,
    payload: unknown,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleQuickPayCreatePaymentLinkRequestPayload(
        validatePayload(payload, quickPayCreatePaymentLinkPayload),
        {
            api_key: process.env.QUICKPAY_API_KEY ?? storeFrontConfig.configuration?.QUICKPAY_API_KEY ?? '',
            fetchCart: async () => {
                return cartWrapper.cart;
            },
            createPaymentArguments: (cart: Cart) => {
                const orderCartLink = buildLanguageMarketAwareLink(
                    `/order/cart/${cartWrapper.cartId}`,
                    context.language,
                    context.market,
                );

                return {
                    amount: cart.total.gross * 100, // in cents
                    currency: cart.total.currency,
                    urls: {
                        continue: `${context.baseUrl}${orderCartLink}`,
                        cancel: `${context.baseUrl}/cancel-payment`,
                        callback: `${context.baseUrl}/api/webhook/payment/quickpay`,
                    },
                };
            },
        },
    );
};
