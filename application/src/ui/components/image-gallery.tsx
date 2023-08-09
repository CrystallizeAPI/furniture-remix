import { Image } from '@crystallize/reactjs-components';
import { Image as ImageType } from '../../use-cases/contracts/Image';

export const ImageGallery: React.FC<{ images: ImageType[] }> = ({ images }) => {
    const galleryHasOddNubmer = images?.length % 2 || false;
    if (!images || images.length === 0) {
        return null;
    }
    return (
        <div className="frntr-img-gallery ">
            {images.map((img, i) => {
                if (img.variants.length === 0) return null;
                const isPortraitImg = img.variants[0].height > img.variants[0].width;
                return (
                    <div key={i} className={`${isPortraitImg ? 'portrait' : 'landscape'} frntr-img`}>
                        <Image
                            {...img}
                            sizes={`${i < 1 || (i === images?.length && !galleryHasOddNubmer) ? '50vw' : '33vw'}`}
                            loading="lazy"
                        />
                    </div>
                );
            })}
        </div>
    );
};
