import { createOrderFetcher } from '@crystallize/js-api-client';
import { handleOrdersRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { LoaderFunction } from '@remix-run/node';
import { authenticate } from '~/core-server/authentication.server';
import { getHost } from '~/core-server/http-utils.server';
import { privateJson } from '~/core-server/privateJson.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const loader: LoaderFunction = async ({ request }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));
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
