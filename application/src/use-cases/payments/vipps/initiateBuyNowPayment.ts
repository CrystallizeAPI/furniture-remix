import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    VippsAppCredentials,
    handleVippsInitiateExpressCheckoutRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import { buildLanguageMarketAwareLink } from '~/use-cases/LanguageAndMarket';
import { RequestContext } from '~/use-cases/http/utils';

export default async (cartWrapper: CartWrapper, context: RequestContext, storeFrontConfig: TStoreFrontConfig) => {
    const credentials: VippsAppCredentials = {
        origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
        clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
        clientSecret: process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
        merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
        subscriptionKey:
            process.env.VIPPS_SUBSCRIPTION_KEY ?? storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ?? '',
    };
    const orderCartUrl = buildLanguageMarketAwareLink(
        `/order/cart/${cartWrapper.cartId}`,
        context.language,
        context.market,
    );

    const webhookCallbackUrl = `/api/webhook/payment/vipps`;

    return await handleVippsInitiateExpressCheckoutRequestPayload(
        { cartId: cartWrapper.cartId },
        {
            ...credentials,
            fetchCart: async () => {
                return cartWrapper.cart;
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
