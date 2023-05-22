import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    handleAdyenPaymentSessionPayload,
    adyenPaymentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { RequestContext, validatePayload } from '../../http/utils';
import { buildLanguageMarketAwareLink } from '../../LanguageAndMarket';

export default async (
    cartWrapper: CartWrapper,
    context: RequestContext,
    payload: unknown,
    storeFrontConfig: TStoreFrontConfig,
) => {
    const orderCartLink = buildLanguageMarketAwareLink(
        `/order/cart/${cartWrapper.cartId}`,
        context.language,
        context.market,
    );
    const currency = cartWrapper.cart.total.currency.toUpperCase();

    return await handleAdyenPaymentSessionPayload(validatePayload(payload, adyenPaymentPayload), {
        currency,
        returnUrl: `${context.baseUrl}${orderCartLink}`,
        merchantAccount:
            process.env.ADYEN_MERCHANT_ACCOUNT ?? storeFrontConfig?.configuration?.ADYEN_MERCHANT_ACCOUNT ?? '',
        apiKey: process.env.ADYEN_API_KEY ?? storeFrontConfig?.configuration?.ADYEN_API_KEY ?? '',
        env: process.env.ADYEN_ENV ?? storeFrontConfig?.configuration?.ADYEN_ENV ?? '',
        countryCode: currency === 'NOK' ? 'NO' : currency === 'USD' ? 'US' : 'FR',
        fetchCart: async () => {
            return cartWrapper.cart;
        },
    });
};
