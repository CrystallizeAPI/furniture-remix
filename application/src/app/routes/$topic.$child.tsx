import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { FilteredProducts } from '~/core/components/filter/filtered-products';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { getHost } from '~/core-server/http-utils.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    let url = request.url;
    let value = `/${params.topic}/${params.child}`;
    const { shared, secret } = await getStoreFront(getHost(request));
    let data = await CrystallizeAPI.searchByTopic(secret.apiClient, value, 'en');
    return json({ data, params }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [value], shared.config));
};

export default () => {
    let { data, params } = useLoaderData();
    let param = params.child.replace(/-/g, ' ');
    let location = useLocation();

    let topic = data?.topics?.aggregations?.topics?.find((item: any) => item.path === location.pathname);

    let topicName = topic.name || param;

    return (
        <div className="container 2xl mx-auto px-6 mt-10">
            <h1 className="capitalize font-bold text-4xl">{topicName}</h1>
            <FilteredProducts products={data?.search?.edges} />
        </div>
    );
};
