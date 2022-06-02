import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { HttpCacheHeaderTaggerFromLoader, SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';

import { Grid } from '~/core/components/grid';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { fetchCampaignPage } from '~/core/UseCases';

import { useLoaderData } from '@remix-run/react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';

type LoaderData = {
    data: Awaited<ReturnType<typeof fetchCampaignPage>>;
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
    const superFast = await getSuperFast(request.headers.get('Host')!);
    const path = `/campaign`;
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const data = await fetchCampaignPage(superFast.apiClient, path, version);
    return json<LoaderData>({ data }, SuperFastHttpCacheHeaderTagger('30s', '30s', [path], superFast.config));
};

export default function HomePage() {
    const { data } = useLoaderData() as LoaderData;
    let grid = data?.component?.content?.grids[0];

    return <div className="mx-auto w-full test">{grid && <Grid grid={grid} />}</div>;
}
