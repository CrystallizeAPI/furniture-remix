import {
    handleQuickPayPaymentUpdateWebhookRequestPayload,
    handleStripePaymentIntentWebhookRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { buildCustomer, pushOrderSubHandler } from '~/use-cases/crystallize/pushOrder.server';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';
import pushCustomerIfMissing from '~/use-cases/crystallize/pushCustomerIfMissing.server';

export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);
    const body = await httpRequest.json();
    const data = await handleQuickPayPaymentUpdateWebhookRequestPayload(body, {
        private_key: process.env.QUICKPAY_PRIVATE_KEY ?? storefront.config?.configuration?.QUICKPAY_PRIVATE_KEY ?? '',
        signature: httpRequest.headers.get('Quickpay-Checksum-Sha256') as string,
        rawBody: body,
        handleEvent: async (event: any) => {
            const cartId = event.variables.cartId;
            switch (event.type?.toLowerCase()) {
                case 'payment':
                    const cartWrapper = await cartWrapperRepository.find(cartId);
                    if (!cartWrapper) {
                        throw {
                            message: `Cart '${cartId}' does not exist.`,
                            status: 404,
                        };
                    }
                    const orderCustomer = buildCustomer(cartWrapper);
                    // we also need to check if the customer is already pushed to crystallize here
                    // we don't await here
                    pushCustomerIfMissing(storefront.apiClient, orderCustomer).catch(console.error);

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

                    const orderCreatedConfirmation = await pushOrderSubHandler(
                        storefront.apiClient,
                        cartWrapper,
                        orderCustomer,
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
    });

    return json(data);
};
