import sharp from 'sharp';
import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { TStoreFront } from '@crystallize/js-storefrontaware-utils';

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

/**
 * Render a list of favicons based on FAVICON_VARIANTS constant
 */
export const Favicons = () => {
    const linkTags = Object.entries(FAVICON_VARIANTS).map(([variant, meta]) => {
        return <link rel={meta.rel} sizes={`${meta.size}x${meta.size}`} href={`/favicon/${variant}.png`} />;
    });

    return <>{linkTags}</>;
};

const QUERY_TENANT_LOGO = `query TENANT_LOGO ($identifier: String!) {
    tenant {
        get(identifier: $identifier) {
            logo {
                url
                mimeType
            }
        }
    }
}`;

export const getLogoForRequestTenant = async (storeFront: TStoreFront): Promise<string | undefined> => {
    const result = await storeFront.apiClient.pimApi(QUERY_TENANT_LOGO, {
        identifier: storeFront.config.tenantIdentifier,
    });
    return result?.tenant?.get?.logo?.url;
};

export const fetchImageBuffer = async (url: string): Promise<ArrayBuffer> => {
    return fetch(url).then(async (res) => res.arrayBuffer());
};

type FaviconOptions = {
    size: number;
    compressionLevel?: number;
    quality?: number;
};
export const generateFavicon = async (original: sharp.Sharp, options: FaviconOptions): Promise<Buffer> => {
    if (!options?.hasOwnProperty?.('size')) {
        throw new Error('Must pass size');
    }

    const opts: FaviconOptions = {
        compressionLevel: 8,
        quality: 80,
        ...options,
    };
    return original
        .resize(opts.size)
        .png({
            compressionLevel: opts.compressionLevel,
            quality: opts.quality,
        })
        .toBuffer();
};
