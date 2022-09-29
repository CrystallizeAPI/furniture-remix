import { getHost } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { createGrid } from '~/lib/grid-tile/createGrid';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { Filter } from '../components/filter';
import { FilteredProducts } from '../components/filter/filtered-products';
import { Grid } from '../components/grid-cells/grid';
import { Folder } from '../components/pdf/folder';

export const fetchData = async (path: string, request: any, params: any): Promise<any> => {
    const url = new URL(request.url);
    const { secret } = await getStoreFront(getHost(request));
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

    return { products, folder, priceRangeAndAttributes };
};

export const PDF = ({ data }: { data: any }) => {
    const { products, folder } = data;
    return <Folder folder={folder} products={products} />;
};

export default ({ data }: { data: any }) => {
    const { products, folder, priceRangeAndAttributes } = data;
    let title =
        folder?.components.find((component: any) => component.type === 'singleLine')?.content?.text || folder.name;
    let description = folder?.components.find((component: any) => component.type === 'richText')?.content?.plainText;
    const hero = folder.components.find((component: any) => component.id === 'hero-content')?.content
        ?.selectedComponent;
    let grid = hero?.content?.grids?.[0] || createGrid(hero?.content?.items);

    return (
        <>
            <div className="container 2xl px-5 mx-auto w-full">
                <h1 className="text-3xl font-bold mt-10 mb-4">{title}</h1>
                <p className="w-3/5 mb-10">{description}</p>
            </div>
            {grid && (
                <div className="w-full mx-auto">
                    <Grid grid={grid} />
                </div>
            )}
            <div className={`container 2xl mt-2 px-5 mx-auto w-full ${grid ? 'mt-20 pt-10' : ''}`}>
                <Filter aggregations={priceRangeAndAttributes} />
                <FilteredProducts products={products} />
            </div>
        </>
    );
};
