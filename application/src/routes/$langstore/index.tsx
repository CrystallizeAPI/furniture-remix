import { HeadersFunction, json, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useLoaderData } from '@remix-run/react';
import { getStoreFront } from '~/use-cases/storefront.server';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import { getContext } from '~/use-cases/http/utils';
import videoStyles from '@crystallize/reactjs-components/assets/video/styles.css';
import LandingPage from '~/ui/pages/LandingPage';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data.data);
};

export const headers: HeadersFunction = ({ parentHeaders, loaderHeaders }) => {
    return {
        ...HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers,
        Link: parentHeaders.get('Link') as string,
    };
};

export const links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: splideStyles },
        { rel: 'stylesheet', href: videoStyles },
    ];
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const path = `/frontpage`;
    const { shared } = await getStoreFront(requestContext.host);
    const user = await authenticatedUser(request);
    const data = await dataFetcherForShapePage(
        'landing-page',
        path,
        requestContext,
        params,
        marketIdentifiersForUser(user),
    );

    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { data } = useLoaderData();
    return <LandingPage data={data} />;
};
