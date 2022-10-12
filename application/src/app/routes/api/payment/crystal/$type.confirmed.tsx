import { ActionFunction, json } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { buildCustomer, pushOrderSubHandler } from '~/use-cases/crystallize/pushOrder.server';
import { cartWrapperRepository } from '~/core-server/services.server';
import { getStoreFront } from '~/core-server/storefront.server';
import pushCustomerIfMissing from '~/use-cases/crystallize/pushCustomerIfMissing.server';

export const action: ActionFunction = async ({ request: httpRequest, params }) => {
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
    pushCustomerIfMissing(storefront.apiClient, orderCustomer).catch(console.error);

    let properties = [
        {
            property: 'amount',
            value: cartWrapper.cart.total.net.toFixed(2),
        },
        {
            property: 'cartId',
            value: cartId,
        },
    ];

    const type = params.type as string;
    const isCoin = type === 'coin';
    const isCard = type === 'card';
    if (!isCoin && !isCard) {
        properties.push({
            property: 'payment_method',
            value: 'Unknown Payment Method',
        });
    }

    if (isCoin) {
        properties.push({
            property: 'payment_method',
            value: 'Crystallize Coin',
        });
    }

    if (isCard) {
        const card = body.card;
        properties.push(
            {
                property: 'payment_method',
                value: 'Crystallize Card',
            },
            {
                property: 'payment_card',
                value: card.number.replace(/.(?=.{4,}$)/g, '*'),
            },
            {
                property: 'payment_card_expiration',
                value: card.expiration,
            },
            {
                property: 'payment_card_country',
                value: card.country,
            },
            {
                property: 'payment_card_zip',
                value: card.zip,
            },
        );
    }

    const orderCreatedConfirmation = await pushOrderSubHandler(storefront.apiClient, cartWrapper, orderCustomer, {
        //@ts-ignore
        provider: 'custom',
        custom: {
            properties,
        },
    });
    return json(orderCreatedConfirmation);
};
