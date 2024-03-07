export const buildMetas = (data: any) => {
    const item = data?.product || data?.folder || data?.document || data?.data || data;

    const metaData =
        item?.meta?.content?.chunks?.[0] || item?.meta?.content?.chunks?.[0] || item?.meta?.content?.chunks?.[0];
    const title = item?.title || metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    const description =
        item?.description || metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText?.[0];
    const image =
        item?.defaultVariant?.images[0]?.url ||
        metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;
    const altDescription = item?.components?.find((comp: any) => comp.id === 'description')?.content?.plainText?.[0];
    const altImage =
        item?.variants?.[0]?.images?.[0]?.url ||
        item?.components?.find((comp: any) => comp.id === 'shoppable-image')?.content?.images?.[0]?.variants?.[0]?.url;

    const seo = {
        title: item?.seo?.title || title || item?.name,
        description: item?.seo?.description || description?.plainText || description || altDescription,
        image: item?.seo?.image || image || altImage,
    };

    return [
        { title: seo.title },
        {
            property: 'og:title',
            content: seo.title,
        },
        { name: 'description', content: seo.description },
        {
            property: 'og:description',
            content: seo.description,
        },
        {
            property: 'og:image',
            content: seo.image,
        },
        {
            property: 'twitter:image',
            content: seo.image,
        },
        {
            property: 'twitter:card',
            content: 'summary_large_image',
        },
        {
            property: 'twitter:description',
            content: seo.description,
        },
    ];
};
