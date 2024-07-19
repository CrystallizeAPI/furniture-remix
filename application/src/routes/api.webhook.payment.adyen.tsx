import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import receivePaymentEvent from '~/use-cases/payments/adyen/receivePaymentEvent';

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const data = await receivePaymentEvent(storefront.apiClient, body);

    return json(data);
};
