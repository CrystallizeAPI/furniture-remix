import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';
import { useAppContext } from '~/core/app-context/provider';
import { StorySlim, CuratedStorySlim } from '~/core/contracts/Story';
import { ItemViewComponentProps } from '~/lib/grid-tile/types';
import { CuratedProduct } from './curated-product';

const DefaultDocument: React.FC<{ item: StorySlim | CuratedStorySlim }> = ({ item }) => {
    const { path } = useAppContext();
    return (
        <Link
            to={path(item.path)}
            prefetch="intent"
            className="grid min-h-[100%] bg-[#F5F5F5] rounded-md overflow-hidden border border-[#f5f5f5] hover:border-[#000]"
        >
            <div className="flex flex-col justify-between items-stretch h-full overflow-hidden w-full">
                <div className="px-10 pt-20 h-1/3 ">
                    <h2 className="text-2xl font-bold mb-3">{item.title}</h2>
                    <p className="embed-text">{item.description.plainText}</p>
                </div>
                <div className="pl-10 pt-10 max-w-full h-full min-h-[400px] img-container overflow-hidden rounded-t-l-md img-cover grow">
                    <Image
                        {...item.medias.images?.[0]}
                        sizes="300px"
                        loading="lazy"
                        className="overflow-hidden rounded-tl-md "
                    />
                </div>
            </div>
        </Link>
    );
};

export const Document: React.FC<{ item: StorySlim | CuratedStorySlim }> = ({ item }) => {
    if (item.type === 'curated-product-story') {
        return <CuratedProduct item={item} />;
    }
    return <DefaultDocument item={item} />;
};

//@todo: not done yet!
// we need to convert from a Tile data to  StorySlim | CuratedStorySlim see like in the ProductFromCell
export const DocumentFromCell: React.FC<ItemViewComponentProps> = ({ item }) => {
    if (item.shape.identifier === 'curated-product-story') {
        return <CuratedProduct item={item} />;
    }
    return <DefaultDocument item={item} />;
};
