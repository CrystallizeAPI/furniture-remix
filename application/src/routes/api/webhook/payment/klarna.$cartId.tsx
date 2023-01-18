import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import receivePaymentEvent from '~/use-cases/payments/klarna/receivePaymentEvent';
import { cartWrapperRepository } from '~/use-cases/services.server';

export const action: ActionFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const cartId = params.cartId as string;
    const body = await request.json();
    const data = await receivePaymentEvent(
        cartWrapperRepository,
        storefront.apiClient,
        cartId,
        body,
        storefront.config,
    );
    return json(data);
};
