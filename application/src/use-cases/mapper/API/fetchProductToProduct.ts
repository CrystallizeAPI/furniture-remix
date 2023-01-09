import { Item, ProductVariant as APIProductVariant, Product as APIProduct } from '@crystallize/js-api-client';
import { Product } from '../../contracts/Product';
import { ProductVariant } from '../../contracts/ProductVariant';
import {
    chunksForChunkComponentWithId,
    flattenRichText,
    itemsForItemRelationComponentWithId,
    paragraphsForParagraphCollectionComponentWithId,
    sectionsForPropertyTableComponentWithId,
    stringForRichTextComponentWithId,
    stringForSingleLineComponentWithId,
} from '../../mapper/api-mappers';
import { DataMapper } from '..';

export default (
    data: Omit<APIProduct, 'variants'> &
        Item & { components: any } & { variants: Array<APIProductVariant & { components: any; description: any }> },
): Product => {
    const mapper = DataMapper();
    const story = paragraphsForParagraphCollectionComponentWithId(data.components, 'story');
    const sections = sectionsForPropertyTableComponentWithId(data.components, 'properties');
    const firstDimensionsChunk = chunksForChunkComponentWithId(data.components, 'dimensions')?.[0];
    const firstSeoChunk = chunksForChunkComponentWithId(data.components, 'meta')?.[0];
    const downloads = chunksForChunkComponentWithId(data.components, 'downloads');
    const relatedItems = itemsForItemRelationComponentWithId(data.components, 'related-items');
    const productDescription = stringForRichTextComponentWithId(data.components, 'description') || data.name!;

    const variants: ProductVariant[] =
        data?.variants?.map((variant) => {
            const mappedVariant = mapper.API.Object.APIProductVariantToProductVariant(variant);
            let description = productDescription;
            const variantDescription = variant?.description?.content?.selectedComponent?.content?.plainText?.join('');
            const variantDescriptionType = variant?.description?.content?.selectedComponent?.id;
            if (variantDescriptionType) {
                description =
                    variantDescriptionType === 'extra'
                        ? productDescription + ' ' + variantDescription
                        : variantDescription;
            }
            return {
                ...mappedVariant,
                description,
            };
        }) || [];

    const defaultVariant = variants.find((variant) => variant.isDefault) || variants[0];

    const dto: Product = {
        id: data.id,
        path: data.path!,
        name: data.name!,
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        description: productDescription,
        story:
            story?.map((paragraph) => {
                return {
                    title: paragraph.title?.text || '',
                    body: flattenRichText(paragraph.body),
                    images: mapper.API.Object.APIImageToImage(paragraph.images),
                    videos: mapper.API.Object.APIVideoToVideo(paragraph.videos),
                };
            }) || [],
        specifications:
            sections?.map((section) => {
                return {
                    title: section.title || '',
                    properties: section.properties || {},
                };
            }) || [],
        dimensions: !firstDimensionsChunk
            ? []
            : firstDimensionsChunk.reduce(
                  (
                      memo: Record<
                          string,
                          {
                              title: string;
                              value: number;
                              unit: string;
                          }
                      >,
                      data: any,
                  ) => {
                      return {
                          ...memo,
                          [data.id]: {
                              title: data.name,
                              value: data?.content?.number || 0.0,
                              unit: data?.content?.unit || '',
                          },
                      };
                  },
                  {},
              ),
        downloads:
            downloads?.map((chunk) => {
                const mapped = chunk.reduce((memo: Record<string, any>, data: any) => {
                    let value = undefined;
                    switch (data.type) {
                        case 'singleLine':
                            value = data.content?.text || '';
                            break;
                        case 'richText':
                            value = data.content?.json || '';
                            break;
                        case 'files':
                            value =
                                data.content?.files?.map((file: any) => {
                                    return {
                                        url: file.url,
                                        title: file.title || '',
                                    };
                                }) || [];
                            break;
                    }
                    return {
                        ...memo,
                        [data.id]: value,
                    };
                }, {});

                return {
                    title: mapped['title' as keyof typeof mapped] || '',
                    description: {
                        json: mapped['description' as keyof typeof mapped],
                    },
                    files: mapped['files' as keyof typeof mapped],
                };
            }) || [],
        relatedItems:
            relatedItems?.map((item) => {
                return {
                    id: item.id,
                    name: item.name,
                    path: item.path,
                    topics: [],
                    variant: mapper.API.Object.APIProductVariantToProductVariant(item.defaultVariant),
                };
            }) || [],
        topics:
            data.topics?.map((topic) => {
                return {
                    name: topic.name,
                    path: topic.path,
                };
            }) || [],
        seo: mapper.API.Object.APIMetaSEOComponentToSEO(firstSeoChunk),
        vat: {
            name: data.vatType?.name || 'Exempt.',
            rate: data.vatType?.percent || 0.0,
        },
        variants,
        defaultVariant,
    };
    return dto;
};
