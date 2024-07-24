import type { ClientInterface } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { Cart } from '~/use-cases/contracts/RemoteCart';

type Deps = {
    apiClient: ClientInterface;
};

export const fetchCart = async (cartId: string, { apiClient }: Deps): Promise<Cart | undefined> => {
    const query = {
        cart: {
            __args: {
                id: cartId,
            },
            id: true,
            state: true,
            orderId: true,
            customer: {
                isGuest: true,
            },
            items: {
                quantity: true,
                variant: {
                    name: true,
                    sku: true,
                    price: {
                        net: true,
                        gross: true,
                        taxAmount: true,
                        discounts: {
                            amount: true,
                            percent: true,
                        },
                    },
                },
                price: {
                    net: true,
                    gross: true,
                    taxAmount: true,
                    discounts: {
                        amount: true,
                        percent: true,
                    },
                },
                images: {
                    url: true,
                    width: true,
                    height: true,
                    altText: true,
                },
            },
            total: {
                net: true,
                gross: true,
                taxAmount: true,
                discounts: {
                    amount: true,
                    percent: true,
                },
                currency: true,
            },
        },
    };
    const rawQuery = jsonToGraphQLQuery({ query });
    try {
        const cart = await apiClient.shopCartApi(rawQuery);
        return cart.cart;
    } catch (exception: any) {
        console.error('Failed to fetch cart', exception.message);
        console.error(exception);
        console.error({ query: rawQuery });
        return undefined;
    }
};
