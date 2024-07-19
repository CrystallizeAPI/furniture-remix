import { ActionFunction, ActionFunctionArgs } from '@remix-run/node';
import { getStoreFront } from '~/use-cases/storefront.server';
import { privateJson } from '~/core/bridge/privateJson.server';
import { getContext } from '~/use-cases/http/utils';
import handleCart from '~/use-cases/checkout/handleSaveCart';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const user = await authenticatedUser(request);
    const markets = marketIdentifiersForUser(user);

    return privateJson(
        await handleCart(
            body,
            {
                apiClient: storefront.apiClient,
            },
            markets,
        ),
    );
};
