import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { handleQuickPayPaymentUpdateWebhookRequestPayload } from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';

export default async (
    apiClient: ClientInterface,
    signature: string,
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleQuickPayPaymentUpdateWebhookRequestPayload(payload, {
        private_key: process.env.QUICKPAY_PRIVATE_KEY ?? storeFrontConfig.configuration?.QUICKPAY_PRIVATE_KEY ?? '',
        signature,
        rawBody: payload,
        handleEvent: async (event: any) => {
            const cartId = event.variables.cartId;
            switch (event.type?.toLowerCase()) {
                case 'payment':
                    const orderIntent = await fetchOrderIntent(cartId, {
                        apiClient,
                    });
                    if (!orderIntent) {
                        throw {
                            message: `Order intent for cart ${cartId} not found`,
                            status: 404,
                        };
                    }
                    let properties = [
                        {
                            property: 'payment_method',
                            value: 'QuickPay',
                        },
                        {
                            property: 'QuickPayPaymentId',
                            value: `${event.id}`,
                        },
                        {
                            property: 'QuickPayOrderId',
                            value: `${event.order_id}`,
                        },
                        {
                            property: 'QuickPayAccepted',
                            value: event.accepted ? 'ACCEPTED' : 'REFUSED',
                        },
                    ];

                    const orderCreatedConfirmation = await pushOrder(
                        orderIntent,
                        {
                            //@ts-ignore
                            provider: 'custom',
                            custom: {
                                properties,
                            },
                        },
                        {
                            apiClient,
                        },
                    );
                    return orderCreatedConfirmation;
            }
        },
    });
};
