import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    Cart,
    handleKlarnaPaymentWebhookRequestPayload,
    KlarnaOrderResponse,
} from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import { getKlarnaOrderInfos, getKlarnaVariables } from './utils';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';
import orderIntentToPaymentCart from '~/use-cases/mapper/API/orderIntentToPaymentCart';

export default async (
    apiClient: ClientInterface,
    cartId: string,
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    const orderIntent = await fetchOrderIntent(cartId, {
        apiClient,
    });
    if (!orderIntent) {
        throw {
            message: `Order intent for cart ${cartId} not found`,
            status: 404,
        };
    }
    const currency = orderIntent.total!.currency.toUpperCase();
    const { locale, origin } = getKlarnaVariables(currency);
    await handleKlarnaPaymentWebhookRequestPayload(payload, {
        cartId,
        origin,
        country: locale.country,
        locale: locale.locale,
        credentials: {
            username: process.env.KLARNA_USERNAME ?? storeFrontConfig.configuration?.KLARNA_USERNAME ?? '',
            password: process.env.KLARNA_PASSWORD ?? storeFrontConfig.configuration?.KLARNA_PASSWORD ?? '',
        },
        fetchCart: async () => {
            const paymentCart = await orderIntentToPaymentCart(orderIntent);
            return paymentCart.cart;
        },
        handleEvent: async (orderResponse: KlarnaOrderResponse) => {
            const orderCreatedConfirmation = await pushOrder(
                orderIntent,
                {
                    //@ts-ignore
                    provider: 'klarna',
                    klarna: {
                        orderId: orderResponse.order_id,
                        merchantReference1: cartId,
                    },
                },
                { apiClient },
            );
            return orderCreatedConfirmation;
        },
        confirmPaymentArguments: (cart: Cart) => {
            return {
                ...getKlarnaOrderInfos(cart),
            };
        },
    });
};
