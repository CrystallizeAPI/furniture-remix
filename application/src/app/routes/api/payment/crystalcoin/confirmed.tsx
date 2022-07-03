import { ActionFunction, json } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { buildCustomer, pushOrderSubHandler } from '~/core-server/orders';
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
    const data = await pushOrderSubHandler(storefront, cartWrapper, buildCustomer(cartWrapper), {
        //@ts-ignore
        provider: 'custom',
        custom: {
            properties: [
                {
                    property: 'payment_method',
                    value: 'Crystallize Coin',
                },
                {
                    property: 'amount',
                    value: cartWrapper.cart.total.net.toFixed(2),
                },
            ],
        },
    });
    return json(data);
};
