import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    dinteroPaymentPayload,
    handleDinteroPaymentSessionPayload,
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

    return await handleDinteroPaymentSessionPayload(validatePayload(payload, dinteroPaymentPayload), {
        credentials: {
            clientId: process.env.DINTERO_CLIENT_ID ?? storeFrontConfig?.configuration?.DINTERO_CLIENT_ID ?? '',
            clientSecret:
                process.env.DINTERO_CLIENT_SECRET ?? storeFrontConfig?.configuration?.DINTERO_CLIENT_SECRET ?? '',
            accountId: process.env.DINTERO_ACCOUNT_ID ?? storeFrontConfig?.configuration?.DINTERO_ACCOUNT_ID ?? '',
        },
        returnUrl: `${context.baseUrl}${orderCartLink}`,
        fetchCart: async () => {
            return cartWrapper.cart;
        },
    });
};
