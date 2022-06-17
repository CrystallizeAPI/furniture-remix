import { HtmlMetaDescriptor } from '@remix-run/react';

export const buildMetas = (data: any): HtmlMetaDescriptor => {
    const item = data?.data || data?.product || data?.folder || data?.document;
    const metaData =
        item?.meta?.content?.chunks?.[0] || item?.meta?.content?.chunks?.[0] || item?.meta?.content?.chunks?.[0];
    const title = metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    const description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText?.[0];
    const image = metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;
    const altDescription = item?.components?.find((comp: any) => comp.id === 'description')?.content?.plainText?.[0];
    let altImage =
        item?.variants?.[0]?.images?.[0]?.url ||
        item.components?.find((comp: any) => comp.id === 'shoppable-image')?.content?.images?.[0]?.variants?.[0]?.url;

    return {
        title: title ? title : item?.name,
        'og:title': title ? title : item?.name,
        description: description || altDescription,
        'og:description': description || altDescription,
        'og:image': image || altImage,
        'twitter:image': image || altImage,
        'twitter:card': 'summary_large_image',
        'twitter:description': description || altDescription,
    };
};
