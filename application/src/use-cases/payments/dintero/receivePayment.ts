import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { handleDinteroVerificationPayload } from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';

export default async (apiClient: ClientInterface, payload: any, storeFrontConfig: TStoreFrontConfig) => {
    return await handleDinteroVerificationPayload(payload, {
        credentials: {
            clientId: process.env.DINTERO_CLIENT_ID ?? storeFrontConfig.configuration?.DINTERO_CLIENT_ID ?? '',
            clientSecret:
                process.env.DINTERO_CLIENT_SECRET ?? storeFrontConfig.configuration?.DINTERO_CLIENT_SECRET ?? '',
            accountId: process.env.DINTERO_ACCOUNT_ID ?? storeFrontConfig.configuration?.DINTERO_ACCOUNT_ID ?? '',
        },
        transactionId: payload,
        handleEvent: async (eventName: string, event: any) => {
            const cartId = event.merchant_reference;
            const orderIntent = await fetchOrderIntent(cartId, {
                apiClient,
            });
            if (!orderIntent) {
                throw {
                    message: `Order intent for cart ${cartId} not found`,
                    status: 404,
                };
            }

            //in case shipping is enabled, customer can change shipping address
            if (event.shipping_option) {
                orderIntent.customer = {
                    ...orderIntent.customer,
                    firstName: event.shipping_address.first_name,
                    lastName: event.shipping_address.last_name,
                    identifier: event.shipping_address.email,
                    addresses: [
                        {
                            //@ts-expect-error
                            type: 'billing',
                            street: event.shipping_address.address_line,
                            city: event.shipping_address.postal_place,
                            country: event.shipping_address.country,
                            postalCode: event.shipping_address.postal_code,
                        },
                    ],
                };
            }
            switch (eventName) {
                case 'AUTHORIZED':
                    const orderCreatedConfirmation = await pushOrder(
                        orderIntent,
                        {
                            //@ts-expect-error
                            provider: 'custom',
                            custom: {
                                properties: [
                                    {
                                        property: 'payment_provider',
                                        value: 'dintero',
                                    },
                                    {
                                        property: 'dintero_transaction_id',
                                        value: event.id,
                                    },
                                    {
                                        property: 'dintero_payment_product_type',
                                        value: event.payment_product_type,
                                    },
                                    {
                                        property: 'shipping_operator | amount',
                                        value: event?.shipping_option
                                            ? `${event?.shipping_option?.operator} | ${
                                                  event?.shipping_option?.amount / 100
                                              }`
                                            : 'No shipping',
                                    },
                                ],
                            },
                        },
                        { apiClient },
                    );
                    return orderCreatedConfirmation;
            }
        },
    });
};
