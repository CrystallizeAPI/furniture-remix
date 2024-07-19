import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { privateJson } from '~/core/bridge/privateJson.server';
import { fetchCart } from '~/use-cases/crystallize/read/fetchCart';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const cart = await fetchCart(params.id!, {
        apiClient: storefront.apiClient,
    });

    if (!cart) {
        throw {
            message: `Cart '${params.id!}' does not exist.`,
            status: 404,
        };
    }
    return privateJson(cart);
};
