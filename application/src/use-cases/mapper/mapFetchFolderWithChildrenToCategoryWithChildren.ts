import { CateogryWithChildren } from '~/core/contracts/Category';
import { CuratedStorySlim, StorySlim } from '~/core/contracts/Story';
import {
    choiceComponentWithId,
    chunksForChunkComponentWithId,
    itemsForItemRelationComponentWithId,
    numericValueForComponentWithId,
    stringForSingleLineComponentWithId,
} from '~/lib/api-mappers';
import mapAPIProductVariantToProductVariant from './mapAPIProductVariantToProductVariant';
import mapFetchFolderToCategory from './mapFetchFolderToCategory';
import typedImages from '~/use-cases/mapper/mapAPIImageToImage';

export default (data: any): CateogryWithChildren => {
    return {
        ...mapFetchFolderToCategory(data),
        children: data.children.map((child: any): CuratedStorySlim | StorySlim => {
            const common = {
                name: child.name,
                path: child.path,
                title: stringForSingleLineComponentWithId(child.components, 'title') || child.name!,
            };
            if (child.shape.identifier === 'curated-product-story') {
                const intro = child.components.find((c: any) => c.id === 'description')?.content;
                const media = child.components.find((c: any) => c.id === 'shoppable-image')?.content;
                return {
                    ...common,
                    description: intro,
                    type: 'curated-product-story',
                    medias: {
                        images: typedImages(media.images),
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
                                            variant: mapAPIProductVariantToProductVariant(product.defaultVariant),
                                            topics: [],
                                        };
                                    }) || [],
                                x: numericValueForComponentWithId(chunk, 'hotspot-x') || 0,
                                y: numericValueForComponentWithId(chunk, 'hotspot-y') || 0,
                            };
                        }) || [],
                };
            } else {
                const intro = child.components.find((c: any) => c.id === 'intro')?.content;
                const media = choiceComponentWithId(child.components, 'media');
                return {
                    ...common,
                    description: intro,
                    type: 'story',
                    medias: {
                        images: media?.id === 'image' ? typedImages(media.content.images) : [],
                        videos: media?.id === 'video' ? [] : [], // @todo: to be implemented
                    },
                };
            }
        }),
    };
};
