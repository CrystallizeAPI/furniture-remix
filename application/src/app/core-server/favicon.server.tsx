import sharp from 'sharp';
import { TStoreFront } from '@crystallize/js-storefrontaware-utils';

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
        .resize({
            width: opts.size,
            height: opts.size,
            fit: sharp.fit.contain,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({
            compressionLevel: opts.compressionLevel,
            quality: opts.quality,
        })
        .toBuffer();
};

export function sharpFromImageBuffer(buffer: Buffer): sharp.Sharp {
    return sharp(buffer);
}
