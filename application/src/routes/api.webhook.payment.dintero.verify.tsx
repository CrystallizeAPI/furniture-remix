import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import receivePayment from '~/use-cases/payments/dintero/receivePayment';
import { getStoreFront } from '~/use-cases/storefront.server';

export let action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const body = await request.json();

    const { secret: storefront } = await getStoreFront(requestContext.host);

    const data = await receivePayment(storefront.apiClient, body.transaction.id, storefront.config);

    return json(data);
};
