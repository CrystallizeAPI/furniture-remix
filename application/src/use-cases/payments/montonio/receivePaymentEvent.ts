import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { handleMontonioPaymentUpdateWebhookRequestPayload } from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import createShipment from './createShipment';
import fetchShipmentLabelUrl from './fetchShipmentLabelUrl';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';
import orderIntentToPaymentCart from '~/use-cases/mapper/API/orderIntentToPaymentCart';

export default async (apiClient: ClientInterface, token: string, storeFrontConfig: TStoreFrontConfig) => {
    return await handleMontonioPaymentUpdateWebhookRequestPayload(
        {},
        {
            secret_key: process.env.MONTONIO_SECRET_KEY ?? storeFrontConfig.configuration?.MONTONIO_SECRET_KEY ?? '',
            token,
            handleEvent: async (event: any) => {
                const cartId = event.merchant_reference;
                switch (event.status) {
                    case 'finalized':
                        const orderIntent = await fetchOrderIntent(cartId, {
                            apiClient,
                        });
                        if (!orderIntent) {
                            throw {
                                message: `Order intent for cart ${cartId} not found`,
                                status: 404,
                            };
                        }
                        const paymentCart = await orderIntentToPaymentCart(orderIntent);
                        // if we have a pickup point we will create a shipment and printing label and add it to the order
                        const shipment = await createShipment(paymentCart, storeFrontConfig).catch(console.log);
                        const shipmentLabelUrl = await fetchShipmentLabelUrl(paymentCart, storeFrontConfig).catch(
                            console.log,
                        );

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
                            orderIntent,
                            {
                                //@ts-ignore
                                provider: 'custom',
                                custom: {
                                    properties,
                                },
                            },
                            {
                                'Shipment UUID': shipment.uuid,
                                'Shipment Label': shipmentLabelUrl,
                            },
                            { apiClient },
                        );
                        return orderCreatedConfirmation;
                }
            },
        },
    );
};
