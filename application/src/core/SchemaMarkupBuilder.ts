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
    const title = data.seo.title;
    const description = data.seo.description;
    const altDescription = data.seo.description;

    return {
        '@context': 'http://schema.org',
        '@type': 'BlogPosting',
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': '',
        },
        headline: title || data.name,
        datePublished: data.createdAt,
        dateModified: new Date(data.updatedAt),
        description: description || altDescription,
    };
};
