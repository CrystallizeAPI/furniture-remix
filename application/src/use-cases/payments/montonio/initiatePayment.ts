import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    Cart,
    CartWrapper,
    handleMontonioCreatePaymentLinkRequestPayload,
    montonioCreatePaymentLinkPayload,
} from '@crystallize/node-service-api-request-handlers';
import { RequestContext, validatePayload } from '../../http/utils';
import { buildLanguageMarketAwareLink } from '../../LanguageAndMarket';

export default async (
    cartWrapper: CartWrapper,
    context: RequestContext,
    payload: unknown,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleMontonioCreatePaymentLinkRequestPayload(
        validatePayload(payload, montonioCreatePaymentLinkPayload),
        {
            origin: process.env.MONTONIO_ORIGIN ?? storeFrontConfig.configuration?.MONTONIO_ORIGIN ?? '',
            access_key: process.env.MONTONIO_ACCESS_KEY ?? storeFrontConfig.configuration?.MONTONIO_ACCESS_KEY ?? '',
            secret_key: process.env.MONTONIO_SECRET_KEY ?? storeFrontConfig.configuration?.MONTONIO_SECRET_KEY ?? '',
            fetchCart: async () => {
                return cartWrapper.cart;
            },
            otherPaymentArgumentsForLink: context.url.searchParams.has('method')
                ? {
                      preselected_aspsp: context.url.searchParams.get('method'),
                  }
                : {},
            createPaymentArguments: (cart: Cart) => {
                const orderCartLink = buildLanguageMarketAwareLink(
                    `/order/cart/${cartWrapper.cartId}`,
                    context.language,
                    context.market,
                );
                return {
                    amount: cart.total.gross,
                    currency: cart.total.currency,
                    urls: {
                        return: `${context.baseUrl}${orderCartLink}`,
                        notification: `${context.baseUrl}/api/webhook/payment/montonio`,
                    },
                    customer: {
                        email: cartWrapper.customer.email,
                        firstName: cartWrapper.customer.firstName,
                        lastName: cartWrapper.customer.lastName,
                    },
                };
            },
        },
    );
};
