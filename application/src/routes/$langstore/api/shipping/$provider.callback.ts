import { ActionFunction, json } from '@remix-run/node';
import shippingOptions from '~/use-cases/payments/dintero/shippingOptions';

export const action: ActionFunction = async ({ request, params }) => {
    if (params.provider !== 'dintero') {
        return json({ error: 'Provider not supported' }, { status: 400 });
    }
    const shippingPoints = await shippingOptions();
    return json(shippingPoints);
};
