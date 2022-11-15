import { handleQuickPayPaymentUpdateWebhookRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { buildCustomer, pushOrderSubHandler } from '~/use-cases/crystallize/pushOrder';
import { cartWrapperRepository } from '~/infrastructure/services.server';
import { getStoreFront } from '~/infrastructure/storefront.server';
import pushCustomerIfMissing from '~/use-cases/crystallize/pushCustomerIfMissing';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const data = await handleQuickPayPaymentUpdateWebhookRequestPayload(body, {
        private_key: process.env.QUICKPAY_PRIVATE_KEY ?? storefront.config?.configuration?.QUICKPAY_PRIVATE_KEY ?? '',
        signature: request.headers.get('Quickpay-Checksum-Sha256') as string,
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
