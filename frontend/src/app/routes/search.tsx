import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import { FilteredProducts } from '~/core/components/filter/filtered-products';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';

export const loader: LoaderFunction = async ({ request }) => {
    const { secret } = await getStoreFront(request.headers.get('Host')!);
    const url = new URL(request.url);
    const params = url.searchParams.get('q');
    let data = await CrystallizeAPI.search(secret.apiClient, params ? params : '');
    return json({ data });
};

export default function SearchPage() {
    let { data } = useLoaderData();

    return (
        <div className="lg:w-content mx-auto w-full">
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
}
