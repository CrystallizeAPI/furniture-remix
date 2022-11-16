import { ActionFunction } from '@remix-run/node';
import { getStoreFront } from '~/core/storefront.server';
import { privateJson } from '~/core/bridge/privateJson.server';
import { getContext } from '~/use-cases/http/utils';
import handleCart from '~/use-cases/checkout/handleSaveCart';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    return privateJson(await handleCart(storefront.apiClient, requestContext, body));
};
