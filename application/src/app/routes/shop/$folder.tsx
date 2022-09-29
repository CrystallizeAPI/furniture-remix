import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import sliderStyles from 'rc-slider/assets/index.css';
import { getStoreFront } from '~/core-server/storefront.server';
import { buildMetas } from '~/core/MicrodataBuilder';
import { getHost } from '~/core-server/http-utils.server';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import PageRenderer from '~/core/pages/index';

export function links() {
    return [
        { rel: 'stylesheet', href: sliderStyles },
        { rel: 'stylesheet', href: splideStyles },
    ];
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(getHost(request));
    const renderer = PageRenderer.resolve('category', request, params);
    const data = await renderer.fetchData(path, request, params);
    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default () => {
    const { data } = useLoaderData();
    const Component = PageRenderer.resolve('category').component;
    return <Component data={data} />;
};
