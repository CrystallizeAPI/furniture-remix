import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';
import { ItemViewComponentProps } from '~/lib/grid-tile/types';
import { CuratedProduct } from './curated-product';

const DefaultDocument = ({ item }: { item: any }) => {
    const title = item?.components?.find((component: any) => component?.id === 'title')?.content?.text;
    const media = item?.components?.find((component: any) => component?.id === 'media')?.content?.selectedComponent
        ?.content;
    const intro = item?.components?.find((component: any) => component?.id === 'intro')?.content?.plainText;
    return (
        <Link
            to={item.path}
            prefetch="intent"
            className="grid min-h-[100%] bg-[#F5F5F5] rounded-md overflow-hidden border border-[#f5f5f5] hover:border-[#000]"
        >
            <div className="flex flex-col justify-between items-stretch h-full overflow-hidden w-full">
                <div className="px-10 pt-20 h-1/3 ">
                    {title && <h2 className="text-2xl font-bold mb-3">{title}</h2>}
                    {intro && <p className="embed-text">{intro}</p>}
                </div>
                <div className="pl-10 pt-10 max-w-full h-full min-h-[400px] img-container overflow-hidden rounded-t-l-md img-cover grow">
                    <Image
                        {...media?.images?.[0]}
                        sizes="300px"
                        loading="lazy"
                        className="overflow-hidden rounded-tl-md "
                    />
                </div>
            </div>
        </Link>
    );
};
export const Document: React.FC<ItemViewComponentProps> = ({ item }) => {
    if (item.shape.identifier === 'curated-product-story') {
        return <CuratedProduct item={item} />;
    }
    return <DefaultDocument item={item} />;
};
