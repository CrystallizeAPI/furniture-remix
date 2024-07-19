import { ClientInterface, CreateOrderInputRequest, Order } from '@crystallize/js-api-client';
import pushOrder from './pushOrder';

type Deps = {
    apiClient: ClientInterface;
};

export default async (orderIntent: CreateOrderInputRequest, type: string, { apiClient }: Deps, card?: any) => {
    const properties = [];
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

    return await pushOrder(
        orderIntent,
        {
            //@ts-ignore
            provider: 'custom',
            custom: {
                properties,
            },
        },
        { apiClient },
    );
};
