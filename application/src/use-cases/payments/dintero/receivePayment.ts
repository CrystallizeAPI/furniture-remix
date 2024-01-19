import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { handleDinteroVerificationPayload } from '@crystallize/node-service-api-request-handlers';
import { cartWrapperRepository } from '~/use-cases/services.server';
import pushOrder from '../../crystallize/write/pushOrder';

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
            const cartWrapper = await cartWrapperRepository.find(cartId);
            if (!cartWrapper) {
                throw {
                    message: `Cart '${cartId}' does not exist.`,
                    status: 404,
                };
            }
            //in case shipping is enabled, customer can change shipping address
            if (event.shipping_option) {
                cartWrapper.customer = {
                    ...cartWrapper.customer,
                    email: event.shipping_address.email,
                    firstname: event.shipping_address.first_name,
                    lastname: event.shipping_address.last_name,
                    customerIdentifier: event.shipping_address.email,
                    streetAddress: event.shipping_address.address_line,
                    city: event.shipping_address.postal_place,
                    country: event.shipping_address.country,
                    zipCode: event.shipping_address.postal_code,
                };
            }
            switch (eventName) {
                case 'AUTHORIZED':
                    const orderCreatedConfirmation = await pushOrder(cartWrapperRepository, apiClient, cartWrapper!, {
                        //@ts-ignore
                        provider: 'custom',
                        custom: {
                            properties: [
                                { property: 'payment_provider', value: 'dintero' },
                                { property: 'dintero_transaction_id', value: event.id },
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
                    });
                    return orderCreatedConfirmation;
            }
        },
    });
};
