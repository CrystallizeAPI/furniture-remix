import { LoaderFunction } from '@remix-run/node';
import sharp from 'sharp';
import { SIZES, getLogoForRequestTenant, fetchImageBuffer, generateFavicon } from '~/lib/image/favicon';

export const loader: LoaderFunction = async ({ request, params }) => {
    const size = Number(params.size);

    if (!SIZES.includes(size)) {
        return new Response('Not found', { status: 404 });
    }

    const logo = await getLogoForRequestTenant(request);

    if (!logo) {
        return new Response('Not found', { status: 404 });
    }

    const arrayBuffer = await fetchImageBuffer(logo);

    if (!arrayBuffer) {
        return new Response('Not found', { status: 404 });
    }

    const original = sharp(Buffer.from(arrayBuffer));

    const resizedPngIcon = await generateFavicon(original, { size });

    return new Response(resizedPngIcon, {
        status: 200,
        headers: {
            'Content-Length': `${resizedPngIcon.byteLength}`,
            'Content-Type': 'image/png',
        },
    });
};
