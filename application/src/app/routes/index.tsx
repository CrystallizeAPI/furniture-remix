import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { useLoaderData } from '@remix-run/react';
import { getStoreFront } from '~/core-server/storefront.server';
import { buildMetas } from '~/core/MicrodataBuilder';
import { getHost } from '~/core-server/http-utils.server';
import PageRenderer from '~/core/pages/index';

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const headers: HeadersFunction = ({ parentHeaders, loaderHeaders }) => {
    return {
        ...HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers,
        Link: parentHeaders.get('Link') as string,
    };
};

export function links() {
    return [{ rel: 'stylesheet', href: splideStyles }];
}

export const loader: LoaderFunction = async ({ request, params }) => {
    const path = `/frontpage`;
    const { shared } = await getStoreFront(getHost(request));
    const renderer = PageRenderer.resolve('landing-page', request, params);
    const data = await renderer.fetchData(path, request, params);
    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { data } = useLoaderData();
    const Component = PageRenderer.resolve('landing-page').component;
    return <Component data={data} />;
};
