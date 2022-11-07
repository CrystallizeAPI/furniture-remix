import { CuratedStory, Story } from '~/core/contracts/Documents';
import {
    choiceComponentWithId,
    stringForSingleLineComponentWithId,
    paragraphsForParagraphCollectionComponentWithId,
    itemsForItemRelationComponentWithId,
    chunksForChunkComponentWithId,
    stringForNumericComponentWithId,
} from '~/lib/api-mappers';
import mapAPIMetaSEOComponentToSEO from './mapAPIMetaSEOComponentToSEO';
import mapAPIProductVariantToProductVariant from './mapAPIProductVariantToProductVariant';
import typedImages from '~/use-cases/mapper/mapAPIImageToImage';

export default (data: any): Story => {
    if (data.shape.identifier === 'curated-product-story') {
        return documentToCuratedStory(data);
    }

    return documentToStory(data);
};

const documentToStory = (data: any): Story => {
    const media = choiceComponentWithId(data.components, 'media');
    const firstSeoChunk = chunksForChunkComponentWithId(data.components, 'meta')?.[0];
    const relatedArticles = itemsForItemRelationComponentWithId(data.components, 'up-next');
    const featuedProducts = itemsForItemRelationComponentWithId(data.components, 'featured');
    const story = paragraphsForParagraphCollectionComponentWithId(data.components, 'story');
    const date = new Date(data.createdAt);
    const creationDate = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const intro = data.components.find((c: any) => c.id === 'intro')?.content?.json;

    const dto = {
        path: data.path,
        shape: data.shape.identifier,
        name: data.name,
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        intro: intro || data.name!,
        createdAt: creationDate,
        updatedAt: data.updatedAt,
        media,
        story:
            story?.map((paragraph) => {
                return {
                    title: paragraph.title?.text || '',
                    body: {
                        json: paragraph.body?.json,
                    },
                    images: typedImages(paragraph.images),
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
                    variant: mapAPIProductVariantToProductVariant(item.defaultVariant),
                };
            }) || [],
        seo: mapAPIMetaSEOComponentToSEO(firstSeoChunk),
    };
    return dto;
};

const documentToCuratedStory = (data: any): CuratedStory => {
    const merchandising = chunksForChunkComponentWithId(data.components, 'merchandising');
    const media = data.components.find((c: any) => c.id === 'shoppable-image');
    const intro = data.components.find((c: any) => c.id === 'description')?.content?.json;
    const story = paragraphsForParagraphCollectionComponentWithId(data.components, 'story');

    const dto = {
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        intro,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        shape: data.shape.identifier,
        path: data.path,
        name: data.name,
        media,
        merchandising:
            merchandising?.map((chunk) => {
                return {
                    products:
                        itemsForItemRelationComponentWithId(chunk, 'products')?.map((product: any) => {
                            return {
                                product,
                            };
                        }) || [],
                    hotspotX: stringForNumericComponentWithId(chunk, 'hotspot-x') || {},
                    hotspotY: stringForNumericComponentWithId(chunk, 'hotspot-y') || {},
                };
            }) || [],
        story:
            story?.map((paragraph) => {
                return {
                    title: paragraph.title?.text || '',
                    body: {
                        json: paragraph.body?.json,
                    },
                    images: typedImages(paragraph.images),
                };
            }) || [],
    };
    return dto;
};
