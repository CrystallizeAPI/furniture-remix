import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import {
    HttpCacheHeaderTagger,
    HttpCacheHeaderTaggerFromLoader,
    SuperFastHttpCacheHeaderTagger,
} from '~/core/Http-Cache-Tagger';

import { GridItem } from '~/core/components/grid-item';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { fetchCampaignPage } from '~/core/UseCases';
// import { GridRenderer, GridRenderingType } from '@crystallize/reactjs-components/dist/grid';

import { useLoaderData } from '@remix-run/react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';

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

const getTotalGridDimensions = (rows) => {
    const totalColSpan = rows[0].columns.reduce((acc, col) => acc + col.layout.colspan, 0);

    return totalColSpan;
};

export default function HomePage() {
    const { data } = useLoaderData();
    let grid = data?.component?.content?.grids[0];

    const totalColSpan = getTotalGridDimensions(grid.rows);
    return (
        <div className="mx-auto w-full test">
            {grid && (
                <div className="frntr-grid auto-rows-auto gap-3">
                    {grid.rows.map((row) => {
                        let isFullWidth;
                        // A workaround to make the fullwidth tiles work properly
                        if (row.columns.length < 2) {
                            isFullWidth = row.columns?.[0].item?.components?.find(
                                (component: any) => component.id === 'fullwidth-tile',
                            )?.content?.value;
                        }
                        return (
                            <div
                                className="grid max-w-full gap-3"
                                style={{
                                    gridColumnStart: isFullWidth ? 'span 3' : 2,
                                    gridTemplateColumns: `repeat(${totalColSpan}, 1fr)`,
                                }}
                            >
                                {row.columns.map((cell) => (
                                    <GridItem cell={cell} />
                                ))}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
