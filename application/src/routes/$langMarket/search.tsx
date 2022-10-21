import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { FilteredProducts } from '~/core/components/filter/filtered-products';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { getContext } from '~/core-server/http-utils.server';
import { useAppContext } from '~/core/app-context/provider';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { shared, secret } = await getStoreFront(requestContext.host);
    const params = requestContext.url.searchParams.get('q');
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
    });
    let data = await api.search(params ? params : '');
    return json(
        { data },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['search'], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { data } = useLoaderData();
    const { _t } = useAppContext();

    return (
        <div className="container px-6 mx-auto w-full">
            <h1 className="font-bold text-4xl mt-10">{_t('label')}</h1>
            {data.length > 0 ? (
                <div>
                    <FilteredProducts products={data} />
                </div>
            ) : (
                <div className="mt-10">{_t('search.noResults')}</div>
            )}
        </div>
    );
};
