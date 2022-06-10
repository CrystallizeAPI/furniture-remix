import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FilteredProducts } from '~/core/components/filter/filtered-products';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    let value = `/${params.topic}/${params.child}`;
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    let data = await CrystallizeAPI.searchByTopic(secret.apiClient, value);
    return json({ data, params }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [value], shared.config));
};

export default function Topics() {
    let { data, params } = useLoaderData();
    return (
        <div className="container 2xl mx-auto px-6 mt-10">
            <h1 className="capitalize font-bold text-4xl">{params.child}</h1>
            <FilteredProducts products={data?.search?.edges} />
        </div>
    );
}
