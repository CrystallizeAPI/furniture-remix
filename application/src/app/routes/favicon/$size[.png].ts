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

    const original = sharp(Buffer.from(arrayBuffer));

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
