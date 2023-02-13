import { Image as APIImage } from '@crystallize/js-api-client';
import { Image } from '../../contracts/Image';

export default (images?: APIImage[]): Image[] => {
    return (
        images?.map((image) => {
            return {
                key: image.key,
                url: image.url!,
                altText: image.altText || '',
                variants:
                    image.variants?.map((variant) => {
                        return {
                            key: variant.key,
                            url: variant.url!,
                            width: variant.width!,
                            height: variant.height!,
                        };
                    }) || [],
                caption: image.caption || {},
            };
        }) || []
    );
};
