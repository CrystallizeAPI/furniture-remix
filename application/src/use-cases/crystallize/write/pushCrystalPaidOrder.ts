import { ClientInterface } from '@crystallize/js-api-client';
import { CartWrapper, CartWrapperRepository } from '@crystallize/node-service-api-request-handlers';
import pushOrder from './pushOrder';

export default async (
    cartWrapperRepository: CartWrapperRepository,
    apiClient: ClientInterface,
    cartWrapper: CartWrapper,
    type: string,
    card?: any,
) => {
    let properties = [
        {
            property: 'amount',
            value: cartWrapper.cart.total.gross.toFixed(2),
        },
        {
            property: 'cartId',
            value: cartWrapper.cartId,
        },
    ];

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
        properties.push(
            {
                property: 'payment_method',
                value: 'Crystallize Card',
            },
            {
                property: 'payment_card',
                value: card?.number?.replace(/.(?=.{4,}$)/g, '*') || 'xxxx-xxxx-xxxx-xxxx',
            },
            {
                property: 'payment_card_expiration',
                value: card?.expiration || 'xx/xx',
            },
            {
                property: 'payment_card_country',
                value: card?.country || 'Unknown',
            },
            {
                property: 'payment_card_zip',
                value: card?.zip || 'xxxxx',
            },
        );
    }

    return await pushOrder(cartWrapperRepository, apiClient, cartWrapper, {
        //@ts-ignore
        provider: 'custom',
        custom: {
            properties,
        },
    });
};
