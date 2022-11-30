import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapperRepository,
    handleMontonioPaymentUpdateWebhookRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';

export default async (
    cartWrapperRepository: CartWrapperRepository,
    apiClient: ClientInterface,
    token: string,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleMontonioPaymentUpdateWebhookRequestPayload(
        {},
        {
            secret_key: process.env.MONTONIO_SECRET_KEY ?? storeFrontConfig.configuration?.MONTONIO_SECRET_KEY ?? '',
            token,
            handleEvent: async (event: any) => {
                const cartId = event.merchant_reference;
                switch (event.status) {
                    case 'finalized':
                        const cartWrapper = await cartWrapperRepository.find(cartId);
                        if (!cartWrapper) {
                            throw {
                                message: `Cart '${cartId}' does not exist.`,
                                status: 404,
                            };
                        }
                        let properties = [
                            {
                                property: 'payment_method',
                                value: 'Montonio',
                            },
                            {
                                property: 'MontonioPaymentUuid',
                                value: `${event.payment_uuid}`,
                            },
                            {
                                property: 'MontonioPaymentMethod',
                                value: `${event.payment_method_name}`,
                            },
                            {
                                property: 'MontonioIBAN',
                                value: `${event.customer_iban}`,
                            },
                        ];

                        const orderCreatedConfirmation = await pushOrder(
                            cartWrapperRepository,
                            apiClient,
                            cartWrapper,
                            {
                                //@ts-ignore
                                provider: 'custom',
                                custom: {
                                    properties,
                                },
                            },
                        );
                        return orderCreatedConfirmation;
                }
            },
        },
    );
};
