import { Product } from './contracts/Product';

export const buildSchemaMarkup = (product: Product) => {
    return {
        '@context': 'https://schema.org/',
        '@type': 'Product',
        name: product.seo.title,
        image: product.seo.image,
        description: product.seo.description,
        sku: product.defaultVariant.sku,
    };
};

export const buildSchemaMarkupForBlogPost = (data: any, url?: any) => {
    const metaData = data?.meta?.content?.chunks?.[0];
    const title = metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    const description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText?.[0];
    const altDescription = data?.components?.find((comp: any) => comp.id === 'description')?.content?.plainText?.[0];

    return {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': '',
        },
        headline: title || data.name,
        datePublished: new Date(data.createdAt),
        dateModified: new Date(data.updatedAt),
        description: description || altDescription,
    };
};
