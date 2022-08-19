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

    const cartId = body.cartId as string;
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

    const data = await pushOrderSubHandler(storefront.apiClient, cartWrapper, orderCustomer, {
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
                {
                    property: 'cartId',
                    value: cartId,
                },
            ],
        },
    });
    return json(data);
};
