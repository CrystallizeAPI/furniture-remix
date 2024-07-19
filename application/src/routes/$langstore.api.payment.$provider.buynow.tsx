import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import initiateBuyNowPayment from '~/use-cases/payments/vipps/initiateBuyNowPayment';
import handlePlaceCart from '~/use-cases/checkout/handlePlaceCart';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';
import orderIntentToPaymentCart from '~/use-cases/mapper/API/orderIntentToPaymentCart';

export const action: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
    if (params.provider !== 'vipps') {
        return json({ error: 'Provider not supported' }, { status: 400 });
    }
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const cart = await handlePlaceCart(body, body.customer, {
        apiClient: storefront.apiClient,
    });
    if (cart) {
        const orderIntent = await fetchOrderIntent(cart.id, {
            apiClient: storefront.apiClient,
        });
        if (!orderIntent) {
            throw {
                message: `Order intent for cart ${cart.id} not found`,
                status: 404,
            };
        }

        const paymentCart = await orderIntentToPaymentCart(orderIntent);
        const data = await initiateBuyNowPayment(paymentCart, requestContext, {
            storeFrontConfig: storefront.config,
            apiClient: storefront.apiClient,
        });
        return json(data);
    }

    return json({ error: 'Failed to handle cart' }, { status: 500 });
};
