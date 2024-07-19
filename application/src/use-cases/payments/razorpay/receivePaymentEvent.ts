import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { handleRazorPayPaymentVerificationPayload } from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';

export default async (apiClient: ClientInterface, payload: any, storeFrontConfig: TStoreFrontConfig) => {
    return await handleRazorPayPaymentVerificationPayload(payload, {
        orderCreationId: payload.orderCreationId,
        razorpayPaymentId: payload.razorpayPaymentId,
        razorpayOrderId: payload.razorpayOrderId,
        razorpaySignature: payload.razorpaySignature,
        key_secret: process.env.RAZORPAY_SECRET || storeFrontConfig.configuration?.RAZORPAY_SECRET || '',
        key_id: process.env.RAZORPAY_ID || storeFrontConfig.configuration?.RAZORPAY_ID || '',
        handleEvent: async (eventName: string, event: any) => {
            const cartId = event.notes.cartId;
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
                case 'success':
                    const orderCreatedConfirmation = await pushOrder(
                        orderIntent,
                        {
                            //@ts-ignore
                            provider: 'custom',
                            custom: {
                                properties: [
                                    {
                                        property: 'razorpay_order_id',
                                        value: event.id,
                                    },
                                    {
                                        property: 'razorpay_receipt',
                                        value: event.receipt,
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
