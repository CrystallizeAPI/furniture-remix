import { ActionFunction } from '@remix-run/node';
import { getStoreFront } from '~/use-cases/storefront.server';
import { privateJson } from '~/core/bridge/privateJson.server';
import { getContext } from '~/use-cases/http/utils';
import handleCart from '~/use-cases/checkout/handleSaveCart';
import { authenticatedUser } from '~/core/authentication.server';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const user = await authenticatedUser(request);

    return privateJson(await handleCart(storefront.config, storefront.apiClient, requestContext, { ...body, user }));
};
