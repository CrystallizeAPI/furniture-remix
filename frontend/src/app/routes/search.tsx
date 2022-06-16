import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FilteredProducts } from '~/core/components/filter/filtered-products';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    const url = new URL(request.url);
    const params = url.searchParams.get('q');
    let data = await CrystallizeAPI.search(secret.apiClient, params ? params : '');
    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['search'], shared.config));
};

export default () => {
    let { data } = useLoaderData();

    return (
        <div className="container px-6 mx-auto w-full">
            <h1 className="font-bold text-4xl mt-10">Search</h1>
            {data.length > 0 ? (
                <div>
                    <FilteredProducts products={data} />
                </div>
            ) : (
                <div className="mt-10">No results found.</div>
            )}
        </div>
    );
};
