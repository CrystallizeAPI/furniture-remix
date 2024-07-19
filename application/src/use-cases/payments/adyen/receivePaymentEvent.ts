import { ClientInterface } from '@crystallize/js-api-client';
import { EnumType } from 'json-to-graphql-query';
import { handleAdyenWebhookRequestPayload } from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';

export default async (apiClient: ClientInterface, payload: any) => {
    //@todo: @dhairyadwivedi: we probably need to add some more checks here
    // it feels pretty unsafe to just accept any payload
    // you will have to fix in the handleAdyenWebhookRequestPayload of the library
    // and pass the right args here via storeFrontConfig probably

    return await handleAdyenWebhookRequestPayload(payload, {
        handleEvent: async () => {
            for (let i = 0; i < payload?.notificationItems?.length; i++) {
                const event = payload?.notificationItems[i]?.NotificationRequestItem;
                const cartId = event.merchantReference;

                switch (event.eventCode) {
                    case 'AUTHORISATION':
                        if (event.success !== 'true') {
                            throw {
                                message: `Payment failed for cart '${cartId}'.`,
                                status: 403,
                            };
                        }
                        const orderIntent = await fetchOrderIntent(cartId, {
                            apiClient,
                        });
                        if (!orderIntent) {
                            throw {
                                message: `Order intent for cart ${cartId} not found`,
                                status: 404,
                            };
                        }
                        const orderCreatedConfirmation = await pushOrder(
                            orderIntent,
                            {
                                provider: new EnumType('custom'),
                                custom: {
                                    properties: [
                                        {
                                            property: 'payment_method',
                                            value: 'Adyen',
                                        },
                                        {
                                            property: 'cartId',
                                            value: cartId,
                                        },
                                    ],
                                },
                            },
                            { apiClient },
                        );
                        return orderCreatedConfirmation;
                }
            }
        },
    });
};
