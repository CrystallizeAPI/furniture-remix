import type { ClientInterface, CreateOrderInputRequest } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

type Deps = {
    apiClient: ClientInterface;
};

export const fetchOrderIntent = async (
    cartId: string,
    { apiClient }: Deps,
): Promise<CreateOrderInputRequest | null> => {
    try {
        const query = {
            orderIntent: {
                __args: {
                    id: cartId,
                },
                order: true,
            },
        };
        const orderIntent = await apiClient.shopCartApi(jsonToGraphQLQuery({ query }));
        return orderIntent.orderIntent.order;
    } catch (exception: any) {
        console.error(`Failed to fetch order intent for ${cartId}`, exception.message);
        return null;
    }
};
