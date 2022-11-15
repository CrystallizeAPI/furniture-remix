import {
    Cart,
    handleKlarnaPaymentWebhookRequestPayload,
    KlarnaOrderResponse,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { buildCustomer, pushOrderSubHandler } from '~/use-cases/crystallize/pushOrder';
import { cartWrapperRepository } from '~/infrastructure/services.server';
import { getStoreFront } from '~/infrastructure/storefront.server';
import pushCustomerIfMissing from '~/use-cases/crystallize/pushCustomerIfMissing';
import { getKlarnaOrderInfos, getKlarnaVariables } from '~/use-cases/klarna/utils';

export const action: ActionFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const cartId = params.cartId as string;
    const body = await request.json();
    const cartWrapper = await cartWrapperRepository.find(cartId);
    if (!cartWrapper) {
        throw {
            message: `Cart '${cartId}' does not exist.`,
            status: 404,
        };
    }
    const currency = cartWrapper.cart.total.currency.toUpperCase();
    const { locale, origin } = getKlarnaVariables(currency);
    const data = await handleKlarnaPaymentWebhookRequestPayload(body, {
        cartId,
        origin,
        country: locale.country,
        locale: locale.locale,
        credentials: {
            username: process.env.KLARNA_USERNAME ?? storefront.config?.configuration?.KLARNA_USERNAME ?? '',
            password: process.env.KLARNA_PASSWORD ?? storefront.config?.configuration?.KLARNA_PASSWORD ?? '',
        },
        fetchCart: async () => {
            return cartWrapper.cart;
        },
        handleEvent: async (orderResponse: KlarnaOrderResponse) => {
            const orderCustomer = buildCustomer(cartWrapper);
            // we also need to check if the customer is already pushed to crystallize here
            // we don't await here
            pushCustomerIfMissing(storefront.apiClient, orderCustomer).catch(console.error);
            const orderCreatedConfirmation = await pushOrderSubHandler(
                storefront.apiClient,
                cartWrapper,
                orderCustomer,
                {
                    //@ts-ignore
                    provider: 'klarna',
                    klarna: {
                        orderId: orderResponse.order_id,
                        merchantReference1: cartId,
                    },
                },
            );
            return orderCreatedConfirmation;
        },
        confirmPaymentArguments: (cart: Cart) => {
            return {
                ...getKlarnaOrderInfos(cart),
            };
        },
    });
    return json(data);
};
