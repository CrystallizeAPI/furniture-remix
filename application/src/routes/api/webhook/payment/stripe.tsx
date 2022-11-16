import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/infrastructure/storefront.server';
import receivePaymentEvent from '~/use-cases/payments/stripe/receivePaymentEvent';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const data = await receivePaymentEvent(
        storefront.apiClient,
        request.headers.get('stripe-signature') as string,
        body,
        storefront.config,
    );

    return json(data);
};
