import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { Filter } from '~/core/components/filter';
import { FilteredProducts } from '~/core/components/filter/filtered-products';
import sliderStyles from 'rc-slider/assets/index.css';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { buildMetas } from '~/core/MicrodataBuilder';
import { Grid } from '~/core/components/grid-cells/grid';
import { getHost } from '~/core-server/http-utils.server';

export function links() {
    return [{ rel: 'stylesheet', href: sliderStyles }];
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const path = `/shop/${params.folder}`;
    const { shared, secret } = await getStoreFront(getHost(request));
    const api = CrystallizeAPI(secret.apiClient, 'en', url.searchParams?.has('preview'));

    const searchParams = {
        orderBy: url.searchParams.get('orderBy'),
        filters: {
            price: {
                min: url.searchParams.get('min'),
                max: url.searchParams.get('max'),
            },
        },
        attributes: url.searchParams.getAll('attr'),
    };
    // we don't need to consider the preview params here.
    url.searchParams.delete('preview');

    //@todo: we have way too many query/fetch here, we need to agregate the query, GraphQL ;) => we can reduce to one call.

    const [folder, products, priceRangeAndAttributes] = await Promise.all([
        api.fetchFolder(path),
        api.searchOrderBy(path, searchParams.orderBy, searchParams.filters, searchParams.attributes),
        api.fetchPriceRangeAndAttributes(path),
    ]);

    if (!folder) {
        throw new Response('Folder Not Found', {
            status: 404,
            statusText: 'Folder Not Found',
        });
    }

    return json(
        { products, folder, priceRangeAndAttributes },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config),
    );
};

export default () => {
    const { folder, products, priceRangeAndAttributes } = useLoaderData();
    let title =
        folder?.components.find((component: any) => component.type === 'singleLine')?.content?.text || folder.name;
    let description = folder?.components.find((component: any) => component.type === 'richText')?.content?.plainText;
    const hero = folder.components.find((component: any) => component.id === 'hero-content')?.content
        ?.selectedComponent;
    let grid = hero?.content?.grids?.[0];

    return (
        <>
            <div className="container 2xl px-5 mx-auto w-full">
                <h1 className="text-3xl font-bold mt-10 mb-4">{title}</h1>
                <p className="w-3/5 mb-10">{description}</p>
            </div>
            {grid && (
                <div className="w-full  mx-auto 2xl">
                    <Grid grid={grid} />
                </div>
            )}
            <div className="container 2xl mt-20 px-5 mx-auto w-full">
                <Filter aggregations={priceRangeAndAttributes} />
                <FilteredProducts products={products} />
            </div>
        </>
    );
};
