import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';

import { GridItem } from '~/core/components/grid-item';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { fetchCampaignPage } from '~/core/UseCases';
import { GridRenderer, GridRenderingType } from '@crystallize/reactjs-components/dist/grid';

import { useLoaderData } from '@remix-run/react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';

export const headers: HeadersFunction = ({ parentHeaders }) => {
    return {
        ...HttpCacheHeaderTagger('1m', '1w', ['home']).headers,
        Link: parentHeaders.get('Link') as string,
    };
};

export function links() {
    return [{ rel: 'stylesheet', href: splideStyles }];
}

export const loader: LoaderFunction = async ({ request }) => {
    const superFast = await getSuperFast(request.headers.get('Host')!);
    const path = `/campaign`;
    const data = await fetchCampaignPage(superFast.apiClient, path);
    return json({ data }, HttpCacheHeaderTagger('30s', '1w', [path]));
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
