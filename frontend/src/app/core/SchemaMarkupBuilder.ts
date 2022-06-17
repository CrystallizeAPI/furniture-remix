
export const buildSchemaMarkup = (data: any) => {
    const metaData = data?.meta?.content?.chunks?.[0]
    const title = metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    const description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText?.[0];
    const image = metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;
    let altDescription = data?.components?.find((component: any) => component.type === 'richText')?.content?.plainText?.[0];
    let altImage = data?.variants?.[0]?.images?.[0]?.url
    let sku = data?.variants?.[0]?.sku;

    return {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": title ? title : data?.name,
        "image": image || altImage,
        "description": description || altDescription,
        sku,
    };
}

export const buildSchemaMarkupForBlogPost = (data: any, url?: any) => {
    const metaData = data?.meta?.content?.chunks?.[0]
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

    }
}

