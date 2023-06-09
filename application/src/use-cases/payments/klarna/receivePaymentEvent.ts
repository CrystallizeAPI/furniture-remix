import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    Cart,
    CartWrapperRepository,
    handleKlarnaPaymentWebhookRequestPayload,
    KlarnaOrderResponse,
} from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';
import { getKlarnaOrderInfos, getKlarnaVariables } from './utils';

export default async (
    cartWrapperRepository: CartWrapperRepository,
    apiClient: ClientInterface,
    cartId: string,
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    const cartWrapper = await cartWrapperRepository.find(cartId);
    if (!cartWrapper) {
        throw {
            message: `Cart '${cartId}' does not exist.`,
            status: 404,
        };
    }
    const currency = cartWrapper.cart.total.currency.toUpperCase();
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
            return cartWrapper.cart;
        },
        handleEvent: async (orderResponse: KlarnaOrderResponse) => {
            const orderCreatedConfirmation = await pushOrder(cartWrapperRepository, apiClient, cartWrapper, {
                //@ts-ignore
                provider: 'klarna',
                klarna: {
                    orderId: orderResponse.order_id,
                    merchantReference1: cartId,
                },
            });
            return orderCreatedConfirmation;
        },
        confirmPaymentArguments: (cart: Cart) => {
            return {
                ...getKlarnaOrderInfos(cart),
            };
        },
    });
};
