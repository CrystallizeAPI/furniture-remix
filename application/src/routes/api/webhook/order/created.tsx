import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/core/storefront.server';
import sendOrderCreatedReceipt from '~/use-cases/user/sendOrderCreatedReceipt';

export const action: ActionFunction = async ({ request }) => {
    if (request.method !== 'POST') {
        return json({ message: 'Method not allowed' }, 405);
    }
    const requestContext = getContext(request);
    const { secret } = await getStoreFront(requestContext.host);
    const payload = await request.json();
    await sendOrderCreatedReceipt(secret.apiClient, payload.order.get);
    return json({ success: true, payload }, 200);
};
