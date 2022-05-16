import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { GridItem } from '~/core/components/grid-item';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { fetchCampaignPage, fetchShop } from '~/core/UseCases';

import { GridRenderer, GridRenderingType } from '@crystallize/reactjs-components/dist/grid';

export const headers: HeadersFunction = ({ parentHeaders }) => {
    return {
        ...HttpCacheHeaderTagger('1m', '1w', ['home']).headers,
        Link: parentHeaders.get('Link') as string,
    };
};

export function links() {
    return [{ rel: 'stylesheet', href: splideStyles }];
}

export const loader: LoaderFunction = async ({ params }) => {
    const path = `/campaign`;
    const data = await fetchCampaignPage(path);
    const shop = await fetchShop('/shop');
    return json({ data, shop }, HttpCacheHeaderTagger('30s', '1w', [path]));
};

export default function HomePage() {
    const { data } = useLoaderData();
    let grid = data?.component?.content?.grids[0];

    return (
        <div className="lg:w-content w-full test mx-auto">
            <GridRenderer
                grid={grid}
                type={GridRenderingType.Div}
                cellComponent={({ cell }: { cell: any }) => <GridItem cell={cell} />}
            />
        </div>
    );
}
