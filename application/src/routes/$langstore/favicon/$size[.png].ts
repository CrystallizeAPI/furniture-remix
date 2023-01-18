import { LoaderFunction } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';

export const FAVICON_VARIANTS = {
    '16': {
        size: 16,
        rel: 'icon',
        extra: {},
    },
    '32': {
        size: 32,
        rel: 'icon',
        extra: {},
    },
    'apple-touch-icon': {
        size: 180,
        rel: 'apple-touch-icon',
        extra: {},
    },
    'safari-pinned-tab': {
        size: 16,
        rel: 'mask-icon',
        extra: {
            color: '#5bbad5',
        },
    },
};

export type FaviconVariant = keyof typeof FAVICON_VARIANTS;

import {
    getLogoForRequestTenant,
    fetchImageBuffer,
    generateFavicon,
    sharpFromImageBuffer,
} from '~/core/favicon.server';

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const size = Number(params.size);

    if (![100, 192, 256, 150].includes(size) && !FAVICON_VARIANTS.hasOwnProperty(size)) {
        return new Response('Not found', { status: 404 });
    }

    const { shared, secret } = await getStoreFront(requestContext.host);
    const logoUrl = await getLogoForRequestTenant(secret);

    if (!logoUrl) {
        return new Response('Not found', { status: 404 });
    }

    const arrayBuffer = await fetchImageBuffer(logoUrl);

    if (!arrayBuffer) {
        return new Response('Not found', { status: 404 });
    }

    const original = sharpFromImageBuffer(Buffer.from(arrayBuffer));

    const resizedPngIcon = await generateFavicon(original, { size: size });

    return new Response(resizedPngIcon, {
        status: 200,
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('1d', '1w', ['favicon'], shared.config.tenantIdentifier).headers,
            'Content-Length': `${resizedPngIcon.byteLength}`,
            'Content-Type': 'image/png',
        },
    });
};
