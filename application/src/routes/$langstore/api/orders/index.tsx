import { createOrderFetcher } from '@crystallize/js-api-client';
import { handleOrdersRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { LoaderFunction } from '@remix-run/node';
import { authenticate } from '~/core/authentication.server';
import { getContext } from '~/use-cases/http/utils';
import { privateJson } from '~/core/bridge/privateJson.server';
import { getStoreFront } from '~/use-cases/storefront.server';

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    try {
        const auth: any = await authenticate(request);
        return privateJson(
            await handleOrdersRequestPayload(null, {
                fetcherByCustomerIdentifier: createOrderFetcher(storefront.apiClient).byCustomerIdentifier,
                user: auth.user.aud,
            }),
        );
    } catch (exception: any) {
        return privateJson({ message: exception.message }, 401);
    }
};
