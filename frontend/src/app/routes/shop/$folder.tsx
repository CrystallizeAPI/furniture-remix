import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { Filter } from '~/core/components/filter';
import { FilteredProducts, ProductsList } from '~/core/components/filter/filtered-products';
import sliderStyles from 'rc-slider/assets/index.css';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';

export function links() {
    return [{ rel: 'stylesheet', href: sliderStyles }];
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }: { data: any }) => {
    let metaData = data?.folder?.meta?.content?.chunks?.[0];
    let title = metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    let description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText;
    let image = metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;

    return {
        title,
        'og:title': title,
        description,
        'og:description': description,
        'og:image':image,
        'twitter:image': image,
        'twitter:card': 'summary_large_image',
        'twitter:description': description,
    };
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/shop/${params.folder}`;
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);

    const searchParams = {
        orderBy: url.searchParams.get('orderBy'),
        filters: {
            price: {
                min: url.searchParams.get('min'),
                max: url.searchParams.get('max'),
            },
        },
    };
    const isFiltered = Array.from(url.searchParams).length > 0;

    //@todo: we have way too many query/fetch here, we need to agregate the query, GraphQL ;)
    // we can reduce to one call.
    const [folder, products, priceRange] = await Promise.all([
        CrystallizeAPI.fetchFolder(secret.apiClient, path, version),
        isFiltered
            ? CrystallizeAPI.searchOrderBy(secret.apiClient, path, searchParams.orderBy, searchParams.filters)
            : CrystallizeAPI.fetchProducts(secret.apiClient, path),
        CrystallizeAPI.getPriceRange(secret.apiClient, path),
    ]);

    return json(
        { products, folder, priceRange, isFiltered },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config),
    );
};

export default function FolderPage() {
    const { folder, products, priceRange, isFiltered } = useLoaderData();
    let title = folder?.components.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = folder?.components.find((component: any) => component.type === 'richText')?.content?.plainText;

    return (
        <div className="container 2xl px-5 mx-auto w-full">
            <h1 className="text-3xl font-bold mt-10 mb-4">{title}</h1>
            <p className="w-3/5 mb-10">{description}</p>
            <Filter priceRange={priceRange} />
            {isFiltered ? <FilteredProducts products={products} /> : <ProductsList products={products} />}
        </div>
    );
}
