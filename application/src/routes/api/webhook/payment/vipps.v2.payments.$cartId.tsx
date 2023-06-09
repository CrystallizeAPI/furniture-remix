import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { cartWrapperRepository } from '~/use-cases/services.server';
import receiveExpressCheckoutEvent from '~/use-cases/payments/vipps/receiveExpressCheckoutEvent';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const data = await receiveExpressCheckoutEvent(
        cartWrapperRepository,
        storefront.apiClient,
        body,
        storefront.config,
    );
    return json(data);
};
