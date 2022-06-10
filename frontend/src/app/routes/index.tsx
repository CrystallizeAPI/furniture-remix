import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useLoaderData } from '@remix-run/react';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { Grid } from '~/core/components/grid-cells/grid';

type LoaderData = {
    data: Awaited<ReturnType<typeof CrystallizeAPI.fetchCampaignPage>>;
};

export let meta: MetaFunction = ({ data, params }: { data: LoaderData, params: any }) => {
    let metaData = data?.data?.meta?.content?.chunks?.[0];
    let title = metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    let description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText?.[0];
    let image = metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;

    return {
        title: title ? title : data?.data?.name,
        'og:title': title ? title : data?.data?.name,
        description,
        'og:description': description,
        'og:image':image,
        'twitter:image': image,
        'twitter:card': 'summary_large_image',
        'twitter:description': description,
    };
};

export const headers: HeadersFunction = ({ parentHeaders, loaderHeaders }) => {
    return {
        ...HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers,
        Link: parentHeaders.get('Link') as string,
    };
};

export function links() {
    return [{ rel: 'stylesheet', href: splideStyles }];
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    const path = `/frontpage`;
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const data = await CrystallizeAPI.fetchCampaignPage(secret.apiClient, path, version);
    return json<LoaderData>({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default function HomePage() {
    const { data } = useLoaderData() as LoaderData;
    let grid = data?.component?.content?.grids;
    return (
        <div className="min-h-[100vh]">
            {grid?.map((grid: any, index: number) => (
                <div key={`${grid.id}-${index}`} className="mx-auto w-full test">
                    <Grid grid={grid} />
                </div>
            ))}
        </div>
    );
}
