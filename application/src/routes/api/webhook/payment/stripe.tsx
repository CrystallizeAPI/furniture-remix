import { handleStripePaymentIntentWebhookRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { buildCustomer, pushOrderSubHandler } from '~/use-cases/crystallize/pushOrder';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';
import pushCustomerIfMissing from '~/use-cases/crystallize/pushCustomerIfMissing';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();

    const data = await handleStripePaymentIntentWebhookRequestPayload(body, {
        secret_key: process.env.STRIPE_SECRET_KEY ?? storefront.config?.configuration?.SECRET_KEY ?? '',
        endpointSecret:
            process.env.STRIPE_SECRET_PAYMENT_INTENT_WEBHOOK_ENDPOINT_SECRET ??
            storefront.config?.configuration?.SECRET_PAYMENT_INTENT_WEBHOOK_ENDPOINT_SECRET ??
            '',
        signature: request.headers.get('stripe-signature') as string,
        rawBody: body,
        handleEvent: async (eventName: string, event: any) => {
            const cartId = event.data.object.metadata.cartId;
            switch (eventName) {
                case 'payment_intent.succeeded':
                    const cartWrapper = await cartWrapperRepository.find(cartId);
                    if (!cartWrapper) {
                        throw {
                            message: `Cart '${cartId}' does not exist.`,
                            status: 404,
                        };
                    }
                    const orderCustomer = buildCustomer(cartWrapper);
                    // we also need to check if the customer is already pushed to crystallize here
                    // we don't await here
                    pushCustomerIfMissing(storefront.apiClient, orderCustomer).catch(console.error);

                    const orderCreatedConfirmation = await pushOrderSubHandler(
                        storefront.apiClient,
                        cartWrapper,
                        orderCustomer,
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
                    );
                    return orderCreatedConfirmation;
            }
        },
    });
    return json(data);
};
