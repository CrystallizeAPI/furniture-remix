import { LoaderFunction } from '@remix-run/node';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import sharp from 'sharp';

const supportedSizes = [16, 32, 64, 128];

export const loader: LoaderFunction = async ({ request, params }) => {
    const size = Number(params.size);

    if (!supportedSizes.includes(size)) {
        return new Response('err', {
            status: 404,
        });
    }

    const { secret } = await getStoreFront(getHost(request));
    const result = await secret.apiClient.pimApi(
        `query ($identifier: String!) {
            tenant {
                get(identifier: $identifier) {
                    logo {
                        url
                        mimeType
                    }
                }
            }
        }`,
        {
            identifier: secret.config.tenantIdentifier,
        },
    );

    const logo = result?.tenant?.get?.logo?.url;

    const { arrayBuffer, mime } = await fetch(logo).then(async (res) => {
        return {
            arrayBuffer: await res.arrayBuffer(),
            mime: res.headers.get('Content-Type') as string,
        };
    });

    if (!arrayBuffer) {
        return new Response('err', {
            status: 404,
        });
    }

    const original = sharp(Buffer.from(arrayBuffer));

    const resizedPngIcon = await original
        .resize(size)
        .png({
            compressionLevel: 8,
            quality: 80,
        })
        .toBuffer();

    return new Response(resizedPngIcon, {
        status: 200,
        headers: {
            'Content-Length': `${resizedPngIcon.byteLength}`,
            'Content-Type': 'image/png',
        },
    });
};
