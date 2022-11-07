import { RequestContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { Filter } from '../components/filter';
import { FilteredProducts } from '../components/filter/filtered-products';
import { Grid } from '../components/grid-cells/grid';
import { Cateogry } from '../contracts/Category';
import { ProductSlim } from '../contracts/Product';

export const fetchData = async (
    path: string,
    request: RequestContext,
    params: any,
): Promise<{
    category: Cateogry;
    products: ProductSlim[];
    priceRangeAndAttributes: any;
}> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    const url = request.url;
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
    const [category, products, priceRangeAndAttributes] = await Promise.all([
        api.fetchFolder(path),
        api.searchOrderBy(path, searchParams.orderBy, searchParams.filters, searchParams.attributes),
        api.fetchPriceRangeAndAttributes(path),
    ]);

    if (!category) {
        throw new Response('Category Not Found', {
            status: 404,
            statusText: 'Category Not Found',
        });
    }

    return { products, category, priceRangeAndAttributes };
};

export default ({ data }: { data: Awaited<ReturnType<typeof fetchData>> }) => {
    const { products, category, priceRangeAndAttributes } = data;
    return (
        <>
            <div className="container 2xl px-5 mx-auto w-full">
                <h1 className="text-3xl font-bold mt-10 mb-4">{category.title}</h1>
                <p className="w-3/5 mb-10">{category.description}</p>
            </div>
            {category.hero && (
                <div className="w-full mx-auto">
                    <Grid grid={category.hero} />
                </div>
            )}
            <div className={`container 2xl mt-2 px-5 mx-auto w-full ${category.hero ? 'mt-20 pt-10' : ''}`}>
                <Filter aggregations={priceRangeAndAttributes} />
                <FilteredProducts products={products} />
            </div>
        </>
    );
};
