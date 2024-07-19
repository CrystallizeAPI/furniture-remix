import {
    ClientInterface,
    createOrderPusher,
    OrderCreatedConfirmation,
    PaymentInputRequest,
} from '@crystallize/js-api-client';
import { fulfillCart } from './editCart';

type Deps = {
    apiClient: ClientInterface;
};

export default async (
    orderIntent: any,
    payment: PaymentInputRequest,
    { apiClient }: Deps,
    metadata?: Record<string, string>,
): Promise<OrderCreatedConfirmation> => {
    orderIntent.payment = [payment];
    orderIntent.meta = [
        ...(orderIntent.meta || []),
        ...(metadata
            ? Object.entries(metadata).map(([key, value]) => ({
                  key,
                  value,
              }))
            : []),
    ];

    const pusher = createOrderPusher(apiClient);

    const cartId = orderIntent?.meta.find((meta: any) => meta.key === 'cartId')?.value;

    const orderCreatedConfirmation = await pusher(orderIntent);

    await fulfillCart(cartId, orderCreatedConfirmation.id, {
        apiClient,
    });

    return orderCreatedConfirmation;
};
