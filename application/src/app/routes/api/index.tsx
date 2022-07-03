import { json, LoaderFunction } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const loader: LoaderFunction = async ({ request }) => {
    const { secret: storefront } = await getStoreFront(getHost(request));
    return json({
        msg: `Crystallize Service API - Tenant ${storefront.config.tenantIdentifier}`,
    });
};
