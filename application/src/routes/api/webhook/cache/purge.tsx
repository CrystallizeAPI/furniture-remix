import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/infrastructure/storefront.server';
import purgeKeys from '~/use-cases/fastly/purgeKeys';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    // we keep it simple for now and we purge all cache for the tenant identifier
    const keys = [storefront.config.tenantIdentifier];
    const keyPurged = await purgeKeys(keys);
    return json({
        message: `${Object.keys(keyPurged).length} key(s) soft purged.`,
        keys: keyPurged,
    });
};
