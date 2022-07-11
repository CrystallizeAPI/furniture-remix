import { createOrderFetcher } from '@crystallize/js-api-client';
import { handleOrdersRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { json, LoaderFunction } from '@remix-run/node';
import { authenticate } from '~/core-server/authentication.server';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const loader: LoaderFunction = async ({ request }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));
    try {
        const auth: any = await authenticate(request);
        return json(
            await handleOrdersRequestPayload(null, {
                fetcherByCustomerIdentifier: createOrderFetcher(storefront.apiClient).byCustomerIdentifier,
                user: auth.user.aud,
            }),
        );
    } catch (exception: any) {
        return json({ message: exception.message }, 401);
    }
};
