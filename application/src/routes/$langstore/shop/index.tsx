import { HeadersFunction, json, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/use-cases/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import { getContext } from '~/use-cases/http/utils';
import { Shop } from '~/use-cases/contracts/Shop';
import ShopPage from '~/ui/pages/Shop';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: splideStyles }];
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const path = '/shop';
    const { shared, secret } = await getStoreFront(requestContext.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
        isPreview: requestContext.isPreview,
    });
    const user = await authenticatedUser(request);
    const shop = await api.fetchShop(path, marketIdentifiersForUser(user));

    return json({ shop }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { shop } = useLoaderData() as { shop: Shop };
    return <ShopPage shop={shop} />;
};
