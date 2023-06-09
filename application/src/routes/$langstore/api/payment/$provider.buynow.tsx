import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import initiateBuyNowPayment from '~/use-cases/payments/vipps/initiateBuyNowPayment';
import { hydrateCart } from '~/use-cases/checkout/cart';
import { v4 as uuidv4 } from 'uuid';
import { handleAndPlaceCart } from '~/use-cases/checkout/handlePlaceCart';

export const action: ActionFunction = async ({ request, params }) => {
    if (params.provider !== 'vipps') {
        return json({ error: 'Provider not supported' }, { status: 400 });
    }
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const [cart] = await hydrateCart(storefront.config, storefront.apiClient, body.locale, body);
    const cartWrapper = await handleAndPlaceCart(
        cart,
        {
            isGuest: true,
        },
        uuidv4(),
    );
    const data = await initiateBuyNowPayment(cartWrapper, requestContext, storefront.config);
    return json(data);
};
