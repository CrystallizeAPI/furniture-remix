import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import receivePaymentEvent from '~/use-cases/payments/montonio/receivePaymentEvent';
import { cartWrapperRepository } from '~/use-cases/services.server';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const url = new URL(request.url);
    const token = url.searchParams.get('payment_token') || '';
    const data = await receivePaymentEvent(cartWrapperRepository, storefront.apiClient, token, storefront.config);
    return json(data);
};
