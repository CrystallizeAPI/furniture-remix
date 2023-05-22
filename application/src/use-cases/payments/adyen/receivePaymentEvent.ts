import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapperRepository,
    handleAdyenWebhookRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import { cartWrapperRepository } from '~/use-cases/services.server';
import pushOrder from '../../crystallize/write/pushOrder';

export default async (
    cartWrapper: CartWrapperRepository,
    apiClient: ClientInterface,
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
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
                        const cartWrapper = await cartWrapperRepository.find(cartId);
                        if (event.success !== 'true') {
                            throw {
                                message: `Payment failed for cart '${cartId}'.`,
                                status: 403,
                            };
                        }
                        if (!cartWrapper) {
                            throw {
                                message: `===> Cart '${cartId}' does not exist.`,
                                status: 404,
                            };
                        }
                        const orderCreatedConfirmation = await pushOrder(
                            cartWrapperRepository,
                            apiClient,
                            cartWrapper,
                            {
                                //@ts-ignore
                                provider: 'custom',
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
                        );
                        return orderCreatedConfirmation;
                }
            }
        },
    });
};
