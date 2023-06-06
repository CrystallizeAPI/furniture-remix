import { RequestContext } from './http/utils';
import { getStoreFront } from './storefront.server';
import { CrystallizeAPI } from './crystallize/read';

export default async (
    shapeIdentifier: string,
    path: string,
    request: RequestContext,
    params?: any,
    marketIdentifiers?: string[],
) => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    const url = request.url;
    switch (shapeIdentifier) {
        case 'product':
            const product = await api.fetchProduct(path, marketIdentifiers);
            if (!product) {
                throw new Response('Product Not Found', {
                    status: 404,
                    statusText: 'Product Not Found',
                });
            }
            return {
                product,
                preSelectedSku: request.url.searchParams.get('sku') ?? '',
            };
        case 'category':
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
            console.log('dataFetcherio', url.searchParams);
            // we don't need to consider the preview params here.
            url.searchParams.delete('preview');

            //@todo: we have way too many query/fetch here, we need to agregate the query, GraphQL ;) => we can reduce to one call.
            const [category, products, priceRangeAndAttributes] = await Promise.all([
                api.fetchFolderWithChildren(path, marketIdentifiers),
                api.searchOrderBy(path, searchParams.orderBy, searchParams.filters, searchParams.attributes),
                api.fetchPriceRangeAndAttributes(path),
            ]);

            if (!category) {
                throw new Response('Category Not Found', {
                    status: 404,
                    statusText: 'Category Not Found',
                });
            }
            return { category, products, priceRangeAndAttributes };
        case 'folder':
            return await api.fetchFolderWithChildren(path, marketIdentifiers);
        case 'abstract-story':
        case 'story':
        case 'curated-product-story':
            const story = await api.fetchDocument(path, marketIdentifiers);
            if (!story) {
                throw new Response('Story Not Found', {
                    status: 404,
                    statusText: 'Story Not Found',
                });
            }
            return story;

        case '_topic':
            const { products: topicProducts, topics } = await api.searchByTopic(path);
            const topic = topics.find((topic) => topic.path === path);
            return {
                products: topicProducts,
                topics,
                topic,
            };
        case 'landing-page':
            return await api.fetchLandingPage(path, marketIdentifiers);
    }
    throw new Error(`No page renderer found for shape ${shapeIdentifier}`);
};
