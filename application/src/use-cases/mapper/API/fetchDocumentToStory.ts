import { CuratedStory, Story } from '../../contracts/Story';
import {
    choiceComponentWithId,
    stringForSingleLineComponentWithId,
    paragraphsForParagraphCollectionComponentWithId,
    itemsForItemRelationComponentWithId,
    chunksForChunkComponentWithId,
    numericValueForComponentWithId,
    flattenRichText,
} from '../../mapper/api-mappers';
import { DataMapper, DataMapperInterface } from '..';

export default (data: any): Story | CuratedStory => {
    const mapper = DataMapper();
    if (data.shape.identifier === 'curated-product-story') {
        return documentToCuratedStory(mapper, data);
    }
    return documentToStory(mapper, data);
};

//@todo: we need to create a Mapper for the common properties of the Story and CuratedStory
const documentToStory = (mapper: DataMapperInterface, data: any): Story => {
    const media = choiceComponentWithId(data.components, 'media');
    const firstSeoChunk = chunksForChunkComponentWithId(data.components, 'meta')?.[0];
    const relatedArticles = itemsForItemRelationComponentWithId(data.components, 'up-next') || [];
    const featuedProducts = itemsForItemRelationComponentWithId(data.components, 'featured');
    const story = paragraphsForParagraphCollectionComponentWithId(data.components, 'story');

    const dto: Story = {
        type: 'story',
        path: data.path,
        name: data.name,
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        description: flattenRichText(data.components.find((c: any) => c.id === 'intro')?.content),
        createdAt: data.createdAt,
        medias: {
            images: media?.id === 'image' ? mapper.API.Object.APIImageToImage(media.content.images) : [],
            videos: media?.id === 'video' ? [] : [], // @todo: to be implemented
        },
        story:
            story?.map((paragraph) => {
                return {
                    title: paragraph.title?.text || '',
                    body: flattenRichText(paragraph.body),
                    images: mapper.API.Object.APIImageToImage(paragraph.images),
                };
            }) || [],
        relatedArticles,
        featuredProducts:
            featuedProducts?.map((item) => {
                return {
                    id: item?.id,
                    name: item.name,
                    path: item.path,
                    topics: [],
                    variant: mapper.API.Object.APIProductVariantToProductVariant(item.defaultVariant),
                };
            }) || [],
        seo: mapper.API.Object.APIMetaSEOComponentToSEO(firstSeoChunk),
    };
    return dto;
};

const documentToCuratedStory = (mapper: DataMapperInterface, data: any): CuratedStory => {
    const intro = flattenRichText(data.components.find((c: any) => c.id === 'description')?.content);
    const media = data.components.find((c: any) => c.id === 'shoppable-image')?.content;
    const story = paragraphsForParagraphCollectionComponentWithId(data.components, 'story');
    const firstSeoChunk = chunksForChunkComponentWithId(data.components, 'meta')?.[0];
    const dto: CuratedStory = {
        type: 'curated-product-story',
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        description: intro,
        path: data.path,
        name: data.name,
        medias: {
            images: mapper.API.Object.APIImageToImage(media.images),
            videos: [],
        },
        merchandising:
            chunksForChunkComponentWithId(data.components, 'merchandising')?.map((chunk) => {
                return {
                    products:
                        itemsForItemRelationComponentWithId(chunk, 'products')?.map((product: any) => {
                            return {
                                id: product.id,
                                name: product.name,
                                path: product.path,
                                variant: mapper.API.Object.APIProductVariantToProductVariant(product.defaultVariant),
                                variants: product.variants.map(mapper.API.Object.APIProductVariantToProductVariant),
                                topics: [],
                            };
                        }) || [],
                    x: numericValueForComponentWithId(chunk, 'hotspot-x') || 0,
                    y: numericValueForComponentWithId(chunk, 'hotspot-y') || 0,
                };
            }) || [],
        story:
            story?.map((paragraph) => {
                return {
                    title: paragraph.title?.text || '',
                    body: flattenRichText(paragraph.body),
                    images: mapper.API.Object.APIImageToImage(paragraph.images),
                };
            }) || [],
        relatedArticles: [],
        seo: mapper.API.Object.APIMetaSEOComponentToSEO(firstSeoChunk),
    };
    return dto;
};
