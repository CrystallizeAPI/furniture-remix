import {
    Cart,
    handleKlarnaInitiatePaymentRequestPayload,
    klarnaInitiatePaymentPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getContext, validatePayload } from '~/use-cases/http/utils';
import { getKlarnaOrderInfos, getKlarnaVariables } from '~/use-cases/klarna/utils';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { buildLanguageMarketAwareLink } from '~/core/LanguageAndMarket';

export const action: ActionFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
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
            const orderCartLink = buildLanguageMarketAwareLink(
                `/order/cart/${cartId}`,
                requestContext.language,
                requestContext.market,
            );

            const data = {
                ...getKlarnaOrderInfos(cart),
                urls: {
                    confirmation: `${requestContext.baseUrl}${orderCartLink}`,
                    authorization: `${requestContext.baseUrl}/api/webhook/payment/klarna/${cartId}`,
                },
            };
            return data;
        },
    });
    return json(data);
};
