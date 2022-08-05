import { LoaderFunction } from '@remix-run/node';
import sharp from 'sharp';

import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import {
    FAVICON_VARIANTS,
    FaviconVariant,
    getLogoForRequestTenant,
    fetchImageBuffer,
    generateFavicon,
} from '~/lib/image/favicon';

const CACHE_AGE = '1d';

export const loader: LoaderFunction = async ({ request, params }) => {
    const size = String(params.size);

    if (!FAVICON_VARIANTS.hasOwnProperty(size)) {
        return new Response('Not found', { status: 404 });
    }

    const { shared, secret } = await getStoreFront(getHost(request));
    const logo = await getLogoForRequestTenant(secret);

    if (!logo) {
        return new Response('Not found', { status: 404 });
    }

    const arrayBuffer = await fetchImageBuffer(logo);

    if (!arrayBuffer) {
        return new Response('Not found', { status: 404 });
    }

    const original = sharp(Buffer.from(arrayBuffer));

    const resizedPngIcon = await generateFavicon(original, {
        size: FAVICON_VARIANTS[size as FaviconVariant].size,
    });

    return new Response(resizedPngIcon, {
        status: 200,
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger(CACHE_AGE, CACHE_AGE, ['favicon'], shared.config).headers,
            'Content-Length': `${resizedPngIcon.byteLength}`,
            'Content-Type': 'image/png',
        },
    });
};
