import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    Cart,
    CartWrapper,
    VippsAppCredentials,
    fetchVippsCheckoutSession,
    fetchVippsPayment,
    handleVippsCreateCheckoutSessionRequestPayload,
    handleVippsInitiatePaymentRequestPayload,
    vippsInitiatePaymentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { RequestContext, validatePayload } from '../../http/utils';
import { buildLanguageMarketAwareLink } from '~/use-cases/LanguageAndMarket';
import { v4 as uuidv4 } from 'uuid';
import { pollingUntil } from '~/use-cases/polling';
import receivePaymentEvent from '~/use-cases/payments/vipps/receivePaymentEvent';

// when using the webhook we won't need this
import { cartWrapperRepository } from '~/use-cases/services.server';

export default async (
    cartWrapper: CartWrapper,
    context: RequestContext,
    payload: unknown,
    storeFrontConfig: TStoreFrontConfig,
) => {
    const vippsMethod = context.url.searchParams.get('method') ?? 'CARD';
    const vippsFlowInput = context.url.searchParams.get('flow') ?? 'WEB_REDIRECT';

    const vippsFlow = (() => {
        if (vippsMethod === 'CARD') {
            return 'WEB_REDIRECT';
        }
        if (vippsMethod === 'CHECKOUT') {
            if (['IFRAME', 'HANDOFF'].includes(vippsFlowInput)) {
                return 'IFRAME';
            }
        }
        return vippsFlowInput;
    })();

    const credentials: VippsAppCredentials = {
        origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
        clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
        clientSecret: process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
        merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
        subscriptionKey:
            process.env.VIPPS_SUBSCRIPTION_KEY ?? storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ?? '',
    };

    const commons = {
        ...credentials,
        fetchCart: async () => {
            return cartWrapper.cart;
        },
    };

    /** Vipps Checkout flow is different, they use Polling
     * https://developer.vippsmobilepay.com/docs/vipps-developers/common-topics/polling-guidelines/
     *
     * This is a boilerplate we are going to trigger the polling session here and imitate the webhook boilerplate mechanism
     * So the day Vipps Webhooks are available we can just remove this and use the webhook mechanism
     */

    // Checkout flow
    if (vippsMethod === 'CHECKOUT') {
        const handlingResult = await handleVippsCreateCheckoutSessionRequestPayload(
            validatePayload(payload, vippsInitiatePaymentPayload),
            {
                ...commons,
                createCheckoutArguments: (cart: Cart) => {
                    const orderCartLink = buildLanguageMarketAwareLink(
                        `/order/cart/${cartWrapper.cartId}`,
                        context.language,
                        context.market,
                    );
                    const token = uuidv4();
                    return {
                        amount: cart.total.gross * 100, // in cents (not sure here if this is correct)
                        currency: 'NOK', // cart.total.currency,
                        callbackUrl: `${context.baseUrl}/api/webhook/payment/vipps?token=${token}`,
                        returnUrl: `${context.baseUrl}${orderCartLink}`,
                        callbackAuthorizationToken: token,
                        paymentDescription: `Payment for Cart ${cartWrapper.cartId}`,
                    };
                },
            },
        );

        if (handlingResult.pollingUrl) {
            pollingUntil(async () => {
                const { payment, session } = await fetchVippsCheckoutSession(handlingResult.pollingUrl, credentials);
                if (!payment) {
                    return false;
                }
                await receivePaymentEvent(cartWrapperRepository, cartWrapper, payment, storeFrontConfig).catch(
                    console.error,
                );
                return session.paymentDetails?.state !== 'CREATED'; // if that's different from CREATED we stop polling
            });
        }
        return handlingResult;
    }

    // ePayment flow
    const handlingResult = await handleVippsInitiatePaymentRequestPayload(
        validatePayload(payload, vippsInitiatePaymentPayload),
        {
            ...commons,
            createIntentArguments: (cart: Cart) => {
                const orderCartLink = buildLanguageMarketAwareLink(
                    `/order/cart/${cartWrapper.cartId}`,
                    context.language,
                    context.market,
                );
                return {
                    amount: cart.total.gross * 100, // in cents (not sure here if this is correct)
                    currency: 'NOK', // cart.total.currency,
                    paymentMethod: vippsMethod as 'CARD' | 'WALLET',
                    userFlow: vippsFlow as 'PUSH_MESSAGE' | 'NATIVE_REDIRECT' | 'WEB_REDIRECT' | 'QR',
                    returnUrl: `${context.baseUrl}${orderCartLink}`,
                };
            },
        },
    );

    if (handlingResult.reference) {
        pollingUntil(async () => {
            const payment = await fetchVippsPayment(handlingResult.reference, credentials);
            if (!payment) {
                return false;
            }
            await receivePaymentEvent(cartWrapperRepository, cartWrapper, payment, storeFrontConfig).catch(
                console.error,
            );
            return payment.state !== 'CREATED'; // if that's different from CREATED we stop polling
        });
    }
    return handlingResult;
};
