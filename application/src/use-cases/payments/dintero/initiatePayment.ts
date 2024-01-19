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
    const shippingCallbackUrl = buildLanguageMarketAwareLink(
        `/api/shipping/dintero/callback`,
        context.language,
        context.market,
    );

    return await handleDinteroPaymentSessionPayload(validatePayload(payload, dinteroPaymentPayload), {
        credentials: {
            clientId: process.env.DINTERO_CLIENT_ID ?? storeFrontConfig?.configuration?.DINTERO_CLIENT_ID ?? '',
            clientSecret:
                process.env.DINTERO_CLIENT_SECRET ?? storeFrontConfig?.configuration?.DINTERO_CLIENT_SECRET ?? '',
            accountId: process.env.DINTERO_ACCOUNT_ID ?? storeFrontConfig?.configuration?.DINTERO_ACCOUNT_ID ?? '',
            profileId: 'default',
        },
        returnUrl: `${context.baseUrl}${orderCartLink}`,
        callbackUrl: `${context.baseUrl}/api/webhook/payment/dintero/verify`,
        customer: {
            email: cartWrapper.customer?.email ?? '',
            phone: cartWrapper.customer?.phoneNumber ?? '',
            shippingAddress: {
                first_name: cartWrapper.customer?.firstname ?? '',
                last_name: cartWrapper.customer?.lastname ?? '',
                address_line: cartWrapper.customer?.streetAddress ?? '',
                postal_code: cartWrapper.customer?.postalCode ?? '',
                postal_place: cartWrapper.customer?.city ?? '',
                country: cartWrapper.customer?.country ?? '',
            },
            billingAddress: {
                first_name: cartWrapper.customer?.firstname ?? '',
                last_name: cartWrapper.customer?.lastname ?? '',
                address_line: cartWrapper.customer?.streetAddress ?? '',
                postal_code: cartWrapper.customer?.postalCode ?? '',
                postal_place: cartWrapper.customer?.city ?? '',
                country: cartWrapper.customer?.country ?? '',
            },
        },
        express: {
            enabled: true,
            expressCheckoutOptions: {
                shipping_options: [
                    {
                        id: 'bring-pick-up-00001',
                        line_id: 'bring-pick-up-00001-location-0a1f6b',
                        countries: ['NO'],
                        amount: 3900,
                        vat_amount: 975,
                        vat: 25,
                        title: 'Standard',
                        description: 'Pick up at your nearest postal office',
                        delivery_method: 'pick_up',
                        operator: 'Bring',
                        operator_product_id: 'pick-up-00001-location-0a1f6b',
                    },
                ],
                shipping_mode: 'shipping_required',
                shipping_address_callback_url: `${context.baseUrl}${shippingCallbackUrl}`,
                customer_types: ['b2c', 'b2b'],
            },
        },
        fetchCart: async () => {
            return cartWrapper.cart;
        },
    });
};
