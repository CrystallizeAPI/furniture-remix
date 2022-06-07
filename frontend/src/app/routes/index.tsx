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

export let meta: MetaFunction = ({ data }: { data: LoaderData }) => {
    let metaData = data?.data?.meta?.content?.chunks?.[0];

    return {
        title: `${metaData?.[0]?.content?.text}`,
        description: `${metaData?.[1]?.content?.plainText}`,
        'og:image': `${metaData?.[2]?.content?.firstImage?.url}`,
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
    const path = `/campaign`;
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const data = await CrystallizeAPI.fetchCampaignPage(secret.apiClient, path, version);
    return json<LoaderData>({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default function HomePage() {
    const { data } = useLoaderData() as LoaderData;
    let grid = data?.component?.content?.grids;

    return grid.map((grid: any, index: number) => (
        <div key={`${grid.id}-${index}`} className="mx-auto w-full test">
            <Grid grid={grid} />
        </div>
    ));
}
