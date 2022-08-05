import { LoaderFunction } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';

export const FAVICON_VARIANTS = {
    '16': {
        size: 16,
        rel: 'icon',
    },
    '32': {
        size: 32,
        rel: 'icon',
    },
    'apple-touch-icon': {
        size: 180,
        rel: 'apple-touch-icon',
    },
};

export type FaviconVariant = keyof typeof FAVICON_VARIANTS;

import {
    getLogoForRequestTenant,
    fetchImageBuffer,
    generateFavicon,
    sharpFromImageBuffer,
} from '~/core-server/favicon.server';

export const loader: LoaderFunction = async ({ request, params }) => {
    const size = String(params.size);

    if (!FAVICON_VARIANTS.hasOwnProperty(size)) {
        return new Response('Not found', { status: 404 });
    }

    const { shared, secret } = await getStoreFront(getHost(request));
    const logoUrl = await getLogoForRequestTenant(secret);

    if (!logoUrl) {
        return new Response('Not found', { status: 404 });
    }

    const arrayBuffer = await fetchImageBuffer(logoUrl);

    if (!arrayBuffer) {
        return new Response('Not found', { status: 404 });
    }

    const original = sharpFromImageBuffer(Buffer.from(arrayBuffer));

    const resizedPngIcon = await generateFavicon(original, {
        size: FAVICON_VARIANTS[size as FaviconVariant].size,
    });

    return new Response(resizedPngIcon, {
        status: 200,
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('1d', '1w', ['favicon'], shared.config).headers,
            'Content-Length': `${resizedPngIcon.byteLength}`,
            'Content-Type': 'image/png',
        },
    });
};
