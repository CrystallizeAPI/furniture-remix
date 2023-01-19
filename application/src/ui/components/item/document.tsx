'use client';
import { Image } from '@crystallize/reactjs-components';
import Link from '~/bridge/ui/Link';
import { useAppContext } from '../../app-context/provider';
import { StorySlim, CuratedStorySlim } from '~/use-cases/contracts/Story';
import {
    choiceComponentWithId,
    chunksForChunkComponentWithId,
    itemsForItemRelationComponentWithId,
    numericValueForComponentWithId,
    stringForSingleLineComponentWithId,
} from '~/use-cases/mapper/api-mappers';
import { ItemViewComponentProps } from '../../lib/grid-tile/types';
import { CuratedProduct } from './curated-product';
import { DataMapper } from '~/use-cases/mapper';

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
                    <p className="embed-text">{item.description?.plainText}</p>
                </div>
                <div className="pl-10 pt-10 max-w-full h-full min-h-[400px] img-container overflow-hidden rounded-t-l-md img-cover grow">
                    <Image
                        {...item.medias?.images?.[0]}
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

export const DocumentFromCell: React.FC<ItemViewComponentProps> = ({ item }) => {
    const mapper = DataMapper();
    const common = {
        name: item.name,
        path: item.path,
        title: stringForSingleLineComponentWithId(item.components, 'title') || item.name!,
    };

    if (item.shape.identifier === 'curated-product-story') {
        const intro = item.components.find((c: any) => c.id === 'description')?.content;
        const media = item.components.find((c: any) => c.id === 'shoppable-image')?.content;
        return (
            <Document
                item={{
                    ...common,
                    description: intro,
                    type: 'curated-product-story',
                    medias: {
                        images: mapper.API.Object.APIImageToImage(media.images),
                        videos: [],
                    },
                    merchandising:
                        chunksForChunkComponentWithId(item.components, 'merchandising')?.map((chunk) => {
                            return {
                                products:
                                    itemsForItemRelationComponentWithId(chunk, 'products')?.map((product: any) => {
                                        return {
                                            id: product.id,
                                            name: product.name,
                                            path: product.path,
                                            variant: mapper.API.Object.APIProductVariantToProductVariant(
                                                product.defaultVariant,
                                            ),
                                            topics: [],
                                        };
                                    }) || [],
                                x: numericValueForComponentWithId(chunk, 'hotspot-x') || 0,
                                y: numericValueForComponentWithId(chunk, 'hotspot-y') || 0,
                            };
                        }) || [],
                }}
            />
        );
    }

    const intro = item.components.find((c: any) => c.id === 'intro')?.content;
    const media = choiceComponentWithId(item.components, 'media');
    return (
        <Document
            item={{
                ...common,
                description: intro,
                type: 'story',
                medias: {
                    images: media ? mapper.API.Object.APIImageToImage(media.content.images) : [],
                    videos: [],
                },
            }}
        />
    );
};
