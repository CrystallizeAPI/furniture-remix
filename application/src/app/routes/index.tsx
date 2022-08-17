import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useLoaderData } from '@remix-run/react';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { Grid } from '~/core/components/grid-cells/grid';
import { buildMetas } from '~/core/MicrodataBuilder';
import { getHost } from '~/core-server/http-utils.server';
import fetchCampaignPage from '~/use-cases/crystallize/fetchCampaignPage';

type LoaderData = {
    data: Awaited<ReturnType<typeof fetchCampaignPage>>;
};

export let meta: MetaFunction = ({ data }: { data: LoaderData }) => {
    return buildMetas(data);
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
    const path = `/frontpage`;
    const { shared, secret } = await getStoreFront(getHost(request));
    const api = CrystallizeAPI(secret.apiClient, 'en', new URL(request.url).searchParams?.has('preview'));
    const data = await api.fetchCampaignPage(path);
    return json<LoaderData>({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default () => {
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
};
