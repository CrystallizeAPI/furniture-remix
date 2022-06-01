import { json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { FilteredProducts } from '~/core/components/filter/filtered-products';
import { searchByTopic } from '~/core/UseCases';

export const loader: LoaderFunction = async ({ request, params }) => {
    let value = `/${params.topic}/${params.child}`;
    const superFast = await getSuperFast(request.headers.get('Host')!);
    let data = await searchByTopic(superFast.apiClient, value);

    return json({ data, params });
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
