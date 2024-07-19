import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { handleStripePaymentIntentWebhookRequestPayload } from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';

export default async (
    apiClient: ClientInterface,
    signature: string,
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleStripePaymentIntentWebhookRequestPayload(payload, {
        secret_key: process.env.STRIPE_SECRET_KEY ?? storeFrontConfig.configuration?.STRIPE_SECRET_KEY ?? '',
        endpointSecret:
            process.env.STRIPE_SECRET_PAYMENT_INTENT_WEBHOOK_ENDPOINT_SECRET ??
            storeFrontConfig.configuration?.SECRET_PAYMENT_INTENT_WEBHOOK_ENDPOINT_SECRET ??
            '',
        signature,
        rawBody: payload,
        handleEvent: async (eventName: string, event: any) => {
            const cartId = event.data.object.metadata.cartId;
            const orderIntent = await fetchOrderIntent(cartId, {
                apiClient,
            });
            if (!orderIntent) {
                throw {
                    message: `Order intent for cart ${cartId} not found`,
                    status: 404,
                };
            }
            switch (eventName) {
                case 'payment_intent.succeeded':
                    const orderCreatedConfirmation = await pushOrder(
                        orderIntent,
                        {
                            //@ts-ignore
                            provider: 'stripe',
                            stripe: {
                                paymentIntentId: event.data.object.id,
                                paymentMethod: event.data.object.charges.data[0].payment_method_details.type,
                                stripe: `eventId:${event.id}`,
                                metadata: event.data.object.charges.data[0].receipt_url,
                            },
                        },
                        { apiClient },
                    );
                    return orderCreatedConfirmation;
            }
        },
    });
};
