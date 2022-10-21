import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    // we keep it simple for now and we purge all cache for the tenant identifier
    const keys = [storefront.config.tenantIdentifier];
    const response = await fetch(`https://api.fastly.com/service/${process.env.FASTLY_SERVICE_ID}/purge`, {
        method: 'POST',
        headers: {
            'fastly-soft-purge': `1`,
            'Fastly-Key': `${process.env.FASTLY_API_TOKEN}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'surrogate-key': keys.join(' '),
        },
    });
    const keyPurged = await response.json();
    return json({
        message: `${Object.keys(keyPurged).length} key(s) soft purged.`,
        keys: keyPurged,
    });
};
