import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapperRepository,
    VippsAppCredentials,
    fetchVippsPayment,
    handleVippsPayPaymentUpdateWebhookRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import handlePaymentAuthorized from './handlePaymentAuthorized';
import { pollingUntil } from '../../../use-cases/polling';

export default async (
    cartWrapperRepository: CartWrapperRepository,
    apiClient: ClientInterface,
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleVippsPayPaymentUpdateWebhookRequestPayload(payload, {
        handleEvent: async (expressCheckout: any) => {
            const cartId = expressCheckout.orderId;
            const cartWrapper = await cartWrapperRepository.find(cartId);
            if (!cartWrapper) {
                throw {
                    message: `Cart '${cartId}' does not exist.`,
                    status: 404,
                };
            }
            if (expressCheckout?.transactionInfo?.status === 'RESERVE') {
                const credentials: VippsAppCredentials = {
                    origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
                    clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
                    clientSecret:
                        process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
                    merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
                    subscriptionKey:
                        process.env.VIPPS_SUBSCRIPTION_KEY ??
                        storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ??
                        '',
                };
                pollingUntil(async () => {
                    const payment = await fetchVippsPayment(cartId, credentials);
                    if (!payment) {
                        return false;
                    }

                    // here we need to enrich the cart wrapper with user data
                    let customer: any = {
                        firstname: expressCheckout?.userDetails?.firstName ?? '',
                        lastname: expressCheckout?.userDetails?.lastName ?? '',
                        streetAddress:
                            expressCheckout?.shippingDetails?.address?.addressLine1 ??
                            '' + expressCheckout?.shippingDetails?.address?.addressLine2,
                        city: expressCheckout?.shippingDetails?.address?.city ?? '',
                        country: expressCheckout?.shippingDetails?.address?.country ?? '',
                        zipCode: expressCheckout?.shippingDetails?.address?.zipCode ?? '',
                        isGuest: true,
                    };
                    if (expressCheckout?.userDetails?.email) {
                        customer.customerIdentifier = expressCheckout?.userDetails?.email;
                        customer.email = expressCheckout?.userDetails?.email;
                    }
                    const enrichedCartWrapper = {
                        ...cartWrapper,
                        customer,
                    };

                    await handlePaymentAuthorized(
                        cartWrapperRepository,
                        enrichedCartWrapper,
                        payment,
                        apiClient,
                        storeFrontConfig,
                    ).catch(console.error);
                    return payment.state !== 'CREATED'; // if that's different from CREATED we stop polling
                });
            }
            return { status: expressCheckout?.transactionInfo?.status };
        },
    });
};
