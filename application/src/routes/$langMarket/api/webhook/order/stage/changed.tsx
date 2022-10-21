import { ActionFunction, json } from '@remix-run/node';

export const action: ActionFunction = async ({ request }) => {
    return json({
        message: 'Order Pipleline Stage Change Webhook received',
        payload: await request.json(),
    });
};
