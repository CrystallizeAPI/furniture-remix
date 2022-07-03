import { createOrderFetcher } from '@crystallize/js-api-client';
import { handleOrderRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { json, LoaderFunction } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

//@todo: add AUTH
export const loader: LoaderFunction = async ({ request, params }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));

    return json(
        handleOrderRequestPayload(await request.json(), {
            fetcherById: createOrderFetcher(storefront.apiClient).byId,
            user: 'fake@plop',
            orderId: params.id!,
        }),
    );
};
