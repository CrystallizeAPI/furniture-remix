import { createClient } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    CartWrapperRepository,
    handleVippsPayPaymentUpdateWebhookRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import handlePaymentAuthorized from './handlePaymentAuthorized';

export default async (
    cartWrapperRepository: CartWrapperRepository,
    cartWrapper: CartWrapper, // once we actually use the webhook that won't be available, id will be in the payload fetchable by cartWrapperRepository
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    // once again here that is a trick, when use with webhooks we should follow the same dependency injection pattern as the other payment
    const apiClient = createClient({
        tenantId: storeFrontConfig.tenantId,
        tenantIdentifier: storeFrontConfig.tenantIdentifier,
        accessTokenId: storeFrontConfig.configuration.CRYSTALLIZE_ACCESS_TOKEN_ID,
        accessTokenSecret: storeFrontConfig.configuration.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
    });

    return await handleVippsPayPaymentUpdateWebhookRequestPayload(payload, {
        handleEvent: async (payment: any) => {
            if (payment.state === 'AUTHORIZED') {
                return await handlePaymentAuthorized(
                    cartWrapperRepository,
                    cartWrapper,
                    payment,
                    apiClient,
                    storeFrontConfig,
                );
            }
        },
    });
};
