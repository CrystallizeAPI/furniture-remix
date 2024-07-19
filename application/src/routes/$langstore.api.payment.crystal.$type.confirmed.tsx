import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import pushCrystalPaidOrder from '~/use-cases/crystallize/write/pushCrystalPaidOrder';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';

export const action: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const cartId = body.cartId as string;
    const orderIntent = await fetchOrderIntent(cartId, {
        apiClient: storefront.apiClient,
    });
    if (!orderIntent) {
        throw {
            message: `Order intent for cart ${cartId} not found`,
            status: 404,
        };
    }

    const orderCreatedConfirmation = await pushCrystalPaidOrder(
        orderIntent,
        params.type as string,
        { apiClient: storefront.apiClient },
        body.card,
    );
    return json(orderCreatedConfirmation);
};
