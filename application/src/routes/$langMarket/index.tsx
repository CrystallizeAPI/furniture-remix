import { HeadersFunction, json, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useLoaderData } from '@remix-run/react';
import { getStoreFront } from '~/core-server/storefront.server';
import { buildMetas } from '~/core/MicrodataBuilder';
import { getContext } from '~/core-server/http-utils.server';
import PageRenderer from '~/core/pages/index';
import videoStyles from '@crystallize/reactjs-components/assets/video/styles.css';

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
    const renderer = PageRenderer.resolve('landing-page', requestContext, params);
    const data = await renderer.fetchData(path, requestContext, params);
    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { data } = useLoaderData();
    const Component = PageRenderer.resolve('landing-page').component;
    return <Component data={data} />;
};
