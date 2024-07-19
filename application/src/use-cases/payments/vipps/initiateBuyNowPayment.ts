import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    VippsAppCredentials,
    handleVippsInitiateExpressCheckoutRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import { buildLanguageMarketAwareLink } from '~/use-cases/LanguageAndMarket';

import { RequestContext } from '~/use-cases/http/utils';

type Deps = {
    storeFrontConfig: TStoreFrontConfig;
    apiClient: ClientInterface;
};

export default async (cart: CartWrapper, context: RequestContext, { storeFrontConfig, apiClient }: Deps) => {
    const credentials: VippsAppCredentials = {
        origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
        clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
        clientSecret: process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
        merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
        subscriptionKey:
            process.env.VIPPS_SUBSCRIPTION_KEY ?? storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ?? '',
    };
    const orderCartUrl = buildLanguageMarketAwareLink(`/order/cart/${cart.cartId}`, context.language, context.market);

    const webhookCallbackUrl = `/api/webhook/payment/vipps`;

    return await handleVippsInitiateExpressCheckoutRequestPayload(
        { cartId: cart.cartId },
        {
            ...credentials,

            fetchCart: async () => {
                return cart.cart;
            },
            callbackPrefix: `${context.baseUrl}${webhookCallbackUrl}`,
            consentRemovalPrefix: `${context.baseUrl}${buildLanguageMarketAwareLink(
                '/',
                context.language,
                context.market,
            )}`,
            fallback: `${context.baseUrl}${orderCartUrl}`,
            extraMerchantInfo: {
                staticShippingDetails: [
                    {
                        isDefault: 'N',
                        priority: 1,
                        shippingCost: 0,
                        shippingMethod: 'Rocket',
                        shippingMethodId: 'rocket',
                    },
                    {
                        isDefault: 'Y',
                        priority: 2,
                        shippingCost: 0,
                        shippingMethod: 'Bike',
                        shippingMethodId: 'bike',
                    },
                ],
            },
        },
    );
};
