import { ActionFunction, json } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));
    return json({
        message: 'Order Pipleline Stage Change Webhook received',
        payload: await request.json(),
    });
};
