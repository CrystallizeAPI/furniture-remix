import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import receivePaymentEvent from '~/use-cases/payments/montonio/receivePaymentEvent';

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const url = new URL(request.url);
    const token = url.searchParams.get('payment_token') || '';
    const data = await receivePaymentEvent(storefront.apiClient, token, storefront.config);
    return json(data);
};
