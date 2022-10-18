import {
    Cart,
    handleKlarnaInitiatePaymentRequestPayload,
    klarnaInitiatePaymentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getHost, isSecure, validatePayload } from '~/core-server/http-utils.server';
import { getKlarnaOrderInfos, getKlarnaVariables } from '~/core-server/klarna.utis.server';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);
    const body = await httpRequest.json();
    const cartId = body.cartId as string;
    const cartWrapper = await cartWrapperRepository.find(cartId);
    if (!cartWrapper) {
        throw {
            message: `Cart '${cartId}' does not exist.`,
            status: 404,
        };
    }
    const currency = cartWrapper.cart.total.currency.toUpperCase();
    const { locale, origin } = getKlarnaVariables(currency);

    // const baseUrl = `${isSecure(httpRequest) ? 'https' : 'http'}://${host}`;
    const baseUrl = 'https://webhook.site/ff057ab5-2235-4821-bc72-e4b673c97248';
    const data = await handleKlarnaInitiatePaymentRequestPayload(validatePayload(body, klarnaInitiatePaymentPayload), {
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
        initiatePaymentArguments: (cart: Cart) => {
            const cartId = body.cartId as string;
            const params = {
                ...getKlarnaOrderInfos(cart),
                urls: {
                    confirmation: `${baseUrl}/order/cart/${cartId}`,
                    authorization: `${baseUrl}/api/webhook/payment/klarna/${cartId}`,
                },
            };
            return params;
        },
    });
    return json(data);
};
