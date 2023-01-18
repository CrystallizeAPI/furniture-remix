import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapperRepository,
    handleRazorPayPaymentVerificationPayload,
} from '@crystallize/node-service-api-request-handlers';
import { cartWrapperRepository } from '~/use-cases/services.server';
import pushOrder from '../../crystallize/write/pushOrder';

export default async (
    cartWrapper: CartWrapperRepository,
    apiClient: ClientInterface,
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    return await handleRazorPayPaymentVerificationPayload(payload, {
        orderCreationId: payload.orderCreationId,
        razorpayPaymentId: payload.razorpayPaymentId,
        razorpayOrderId: payload.razorpayOrderId,
        razorpaySignature: payload.razorpaySignature,
        key_secret: process.env.RAZORPAY_SECRET || storeFrontConfig.configuration?.RAZORPAY_SECRET || '',
        key_id: process.env.RAZORPAY_ID || storeFrontConfig.configuration?.RAZORPAY_ID || '',
        handleEvent: async (eventName: string, event: any) => {
            const cartId = event.notes.cartId;
            const cartWrapper = await cartWrapperRepository.find(cartId);
            if (!cartWrapper) {
                throw {
                    message: `Cart '${cartId}' does not exist.`,
                    status: 404,
                };
            }
            switch (eventName) {
                case 'success':
                    const orderCreatedConfirmation = await pushOrder(cartWrapperRepository, apiClient, cartWrapper!, {
                        //@ts-ignore
                        provider: 'custom',
                        custom: {
                            properties: [
                                { property: 'razorpay_order_id', value: event.id },
                                { property: 'razorpay_receipt', value: event.receipt },
                            ],
                        },
                    });
                    return orderCreatedConfirmation;
            }
        },
    });
};
