import { CategoryWithChildren } from '../../contracts/Category';
import { CuratedStorySlim, StorySlim } from '../../contracts/Story';
import {
    choiceComponentWithId,
    chunksForChunkComponentWithId,
    itemsForItemRelationComponentWithId,
    numericValueForComponentWithId,
    stringForSingleLineComponentWithId,
} from '../../mapper/api-mappers';
import mapFetchFolderToCategory from './fetchFolderToCategory';
import { DataMapper } from '..';
import { ProductSlim } from '../../contracts/Product';

export default (data: any): CategoryWithChildren => {
    const mapper = DataMapper();

    return {
        ...mapFetchFolderToCategory(data),

        children: data.children?.map((child: any): CuratedStorySlim | StorySlim | ProductSlim | undefined => {
            const common = {
                name: child.name,
                path: child.path,
            };
            if (child.shape.identifier === 'curated-product-story') {
                const title = stringForSingleLineComponentWithId(child.components, 'title') || child.name!;
                const intro = child.components.find((c: any) => c.id === 'description')?.content;
                const media = child.components.find((c: any) => c.id === 'shoppable-image')?.content;
                return {
                    ...common,
                    title,
                    description: intro,
                    type: 'curated-product-story',
                    medias: {
                        images: mapper.API.Object.APIImageToImage(media.images),
                        videos: [],
                    },
                    merchandising:
                        chunksForChunkComponentWithId(child.components, 'merchandising')?.map((chunk) => {
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
                };
            }
            if (child.shape.identifier === 'product') {
                return {
                    id: child.id,
                    ...common,
                    topics: [],
                    variant: mapper.API.Object.APIProductVariantToProductVariant(child.defaultVariant),
                };
            }
            if (child.shape.identifier === 'story') {
                const title = stringForSingleLineComponentWithId(child.components, 'title') || child.name!;
                const intro = child.components.find((c: any) => c.id === 'intro')?.content;
                const media = choiceComponentWithId(child.components, 'media');
                return {
                    ...common,
                    title,
                    description: intro,
                    type: 'story',
                    medias: {
                        images: media?.id === 'image' ? mapper.API.Object.APIImageToImage(media.content.images) : [],
                        videos: media?.id === 'video' ? [] : [], // @todo: to be implemented
                    },
                };
            }
        }),
    };
};
