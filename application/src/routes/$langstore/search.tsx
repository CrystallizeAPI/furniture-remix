import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/use-cases/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { getContext } from '~/use-cases/http/utils';
import Search from '~/ui/pages/Search';

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
    return <Search products={data} />;
};
