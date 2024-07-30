import type { ClientInterface } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { Cart } from '~/use-cases/contracts/RemoteCart';

type Deps = {
    apiClient: ClientInterface;
};

type Input = {
    items: Array<{ sku: string; quantity: number }>;
    context: Record<string, unknown>;
    id?: string;
};
export const hydrateCart = async (
    items: Array<{ sku: string; quantity: number }>,
    { apiClient }: Deps,
    cartId?: string,
    markets?: string[],
    voucherCode?: string,
): Promise<Cart | undefined> => {
    const input: Input = {
        items: items,
        context: {
            price: {
                markets,
                decimals: 2,
                selectedVariantIdentifier: 'sales',
                fallbackVariantIdentifiers: ['default'],
                compareAtVariantIdentifier: 'default',
                voucherCode,
            },
        },
    };

    if (cartId) {
        input.id = cartId;
    }

    try {
        const mutation = {
            hydrate: {
                __args: {
                    input,
                },
                id: true,
                state: true,
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
        const cart = await apiClient.shopCartApi(jsonToGraphQLQuery({ mutation }));
        return cart.hydrate;
    } catch (exception: any) {
        console.error('Failed to update cart', exception.message);
        throw exception;
    }
};

export const fulfillCart = async (cartId: string, orderId: string, { apiClient }: Deps) => {
    try {
        const mutation = {
            fulfill: {
                __args: {
                    id: cartId,
                    orderId,
                },
                id: true,
            },
        };
        const cart = await apiClient.shopCartApi(jsonToGraphQLQuery({ mutation }));
        return cart.fulfill.id;
    } catch (exception: any) {
        console.error('Failed to fulfill cart', exception.message);
    }
};

export const setCartCustomer = async (cartId: string, customer: any, isGuest: boolean, { apiClient }: Deps) => {
    try {
        const mutation = {
            setCustomer: {
                __args: {
                    id: cartId,
                    input: {
                        ...customer,
                        isGuest,
                    },
                },
                id: true,
            },
        };
        const cart = await apiClient.shopCartApi(jsonToGraphQLQuery({ mutation }));
        return cart.setCustomer.id;
    } catch (exception: any) {
        console.error('Failed to set customer', exception.message);
    }
};
