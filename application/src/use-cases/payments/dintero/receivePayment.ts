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
            switch (eventName) {
                case 'AUTHORIZED':
                    const orderCreatedConfirmation = await pushOrder(cartWrapperRepository, apiClient, cartWrapper!, {
                        //@ts-ignore
                        provider: 'custom',
                        custom: {
                            properties: [
                                { property: 'payment_provider', value: 'dintero' },
                                { property: 'dintero_transaction_id', value: event.id },
                            ],
                        },
                    });
                    return orderCreatedConfirmation;
            }
        },
    });
};
