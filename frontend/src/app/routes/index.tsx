import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import {
    HttpCacheHeaderTagger,
    HttpCacheHeaderTaggerFromLoader,
    SuperFastHttpCacheHeaderTagger,
} from '~/core/Http-Cache-Tagger';

import { GridItem } from '~/core/components/grid-item';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { fetchCampaignPage } from '~/core/UseCases';
import { GridRenderer, GridRenderingType } from '@crystallize/reactjs-components/dist/grid';

import { useLoaderData } from '@remix-run/react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { version } from 'react';

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
    return json({ data }, SuperFastHttpCacheHeaderTagger('30s', '30s', [path], superFast.config));
};

export default function HomePage() {
    const { data } = useLoaderData();
    let grid = data?.component?.content?.grids[0];

    return (
        <div className="lg:w-content mx-auto w-full test">
            {grid && (
                <GridRenderer
                    grid={grid}
                    type={GridRenderingType.Div}
                    cellComponent={({ cell }: { cell: any }) => <GridItem cell={cell} />}
                />
            )}
        </div>
    );
}
