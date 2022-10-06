import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getStoreFront } from '~/core-server/storefront.server';
import { buildMetas } from '~/core/MicrodataBuilder';
import { getHost } from '~/core-server/http-utils.server';
import PageRenderer from '~/core/pages/index';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared } = await getStoreFront(getHost(request));
    const renderer = PageRenderer.resolve('product', request, params);
    const data = await renderer.fetchData(path, request, params);
    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { data } = useLoaderData();
    const Component = PageRenderer.resolve('product').component;
    return <Component data={data} />;
};
