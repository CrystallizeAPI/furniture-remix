import { createOrderFetcher } from '@crystallize/js-api-client';
import { handleOrdersRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { json, LoaderFunction } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

//@todo: add AUTH
export const loader: LoaderFunction = async ({ request }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));

    return json(
        handleOrdersRequestPayload(await request.json(), {
            fetcherByCustomerIdentifier: createOrderFetcher(storefront.apiClient).byCustomerIdentifier,
            user: 'fake@plop',
        }),
    );
};
