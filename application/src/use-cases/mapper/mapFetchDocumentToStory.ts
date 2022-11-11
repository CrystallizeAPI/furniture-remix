import { CuratedStory, Story } from '~/core/contracts/Story';
import {
    choiceComponentWithId,
    stringForSingleLineComponentWithId,
    paragraphsForParagraphCollectionComponentWithId,
    itemsForItemRelationComponentWithId,
    chunksForChunkComponentWithId,
    numericValueForComponentWithId,
} from '~/lib/api-mappers';
import mapAPIMetaSEOComponentToSEO from './mapAPIMetaSEOComponentToSEO';
import mapAPIProductVariantToProductVariant from './mapAPIProductVariantToProductVariant';
import typedImages from '~/use-cases/mapper/mapAPIImageToImage';

export default (data: any): Story | CuratedStory => {
    if (data.shape.identifier === 'curated-product-story') {
        return documentToCuratedStory(data);
    }

    return documentToStory(data);
};

//@todo: we need to create a Mapper for the common properties of the Story and CuratedStory

const documentToStory = (data: any): Story => {
    const media = choiceComponentWithId(data.components, 'media');
    const firstSeoChunk = chunksForChunkComponentWithId(data.components, 'meta')?.[0];
    const relatedArticles = itemsForItemRelationComponentWithId(data.components, 'up-next') || [];
    const featuedProducts = itemsForItemRelationComponentWithId(data.components, 'featured');
    const story = paragraphsForParagraphCollectionComponentWithId(data.components, 'story');
    const date = new Date(data.createdAt);
    const creationDate = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const dto: Story = {
        type: 'story',
        path: data.path,
        name: data.name,
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        description: data.components.find((c: any) => c.id === 'intro')?.content,
        createdAt: creationDate,
        updatedAt: data.updatedAt,
        medias: {
            images: media?.id === 'image' ? typedImages(media.content.images) : [],
            videos: media?.id === 'video' ? [] : [], // @todo: to be implemented
        },
        story:
            story?.map((paragraph) => {
                return {
                    title: paragraph.title?.text || '',
                    body: paragraph.body!,
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
    const intro = data.components.find((c: any) => c.id === 'description')?.content;
    const media = data.components.find((c: any) => c.id === 'shoppable-image')?.content;
    const story = paragraphsForParagraphCollectionComponentWithId(data.components, 'story');
    const firstSeoChunk = chunksForChunkComponentWithId(data.components, 'meta')?.[0];

    const dto: CuratedStory = {
        type: 'curated-product-story',
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        description: intro,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
        path: data.path,
        name: data.name,
        medias: {
            images: typedImages(media.images),
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
                                variant: mapAPIProductVariantToProductVariant(product.defaultVariant),
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
                    body: paragraph.body!,
                    images: typedImages(paragraph.images),
                };
            }) || [],
        relatedArticles: [],
        seo: mapAPIMetaSEOComponentToSEO(firstSeoChunk),
    };
    return dto;
};
