import { json, LoaderFunction } from '@remix-run/node';
import { getContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    return json({
        msg: `Crystallize Service API - Tenant ${storefront.config.tenantIdentifier}`,
    });
};
