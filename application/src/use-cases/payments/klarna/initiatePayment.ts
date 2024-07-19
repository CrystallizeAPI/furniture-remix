import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    handleKlarnaInitiatePaymentRequestPayload,
    klarnaInitiatePaymentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { RequestContext, validatePayload } from '../../http/utils';
import { buildLanguageMarketAwareLink } from '../../LanguageAndMarket';
import { getKlarnaOrderInfos, getKlarnaVariables } from './utils';

export default async (
    cart: CartWrapper,
    context: RequestContext,
    payload: unknown,
    storeFrontConfig: TStoreFrontConfig,
) => {
    const currency = cart.cart.total.currency.toUpperCase();
    const { locale, origin } = getKlarnaVariables(currency);

    return await handleKlarnaInitiatePaymentRequestPayload(validatePayload(payload, klarnaInitiatePaymentPayload), {
        origin,
        country: locale.country,
        locale: locale.locale,
        credentials: {
            username: process.env.KLARNA_USERNAME ?? storeFrontConfig?.configuration?.KLARNA_USERNAME ?? '',
            password: process.env.KLARNA_PASSWORD ?? storeFrontConfig?.configuration?.KLARNA_PASSWORD ?? '',
        },
        fetchCart: async () => {
            return cart.cart;
        },
        initiatePaymentArguments: () => {
            const orderCartLink = buildLanguageMarketAwareLink(
                `/order/cart/${cart.cartId}`,
                context.language,
                context.market,
            );

            const data = {
                ...getKlarnaOrderInfos(cart.cart),
                urls: {
                    confirmation: `${context.baseUrl}${orderCartLink}`,
                    authorization: `${context.baseUrl}/api/webhook/payment/klarna/${cart.cartId}`,
                },
                amount: cart.cart.total.gross * 100,
            };
            return data;
        },
    });
};
