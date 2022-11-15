import { HeadersFunction, json, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import sliderStyles from 'rc-slider/assets/index.css';
import { getStoreFront } from '~/infrastructure/storefront.server';
import { buildMetas } from '~/core/MicrodataBuilder';
import { getContext } from '~/use-cases/http/utils';
import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import PageRenderer from '~/core/pages/index';
import videoStyles from '@crystallize/reactjs-components/assets/video/styles.css';

export const links: LinksFunction = () => {
    return [
        { rel: 'stylesheet', href: sliderStyles },
        { rel: 'stylesheet', href: splideStyles },
        { rel: 'stylesheet', href: videoStyles },
    ];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(requestContext.host);
    const renderer = PageRenderer.resolve('category', requestContext, params);
    const data = await renderer.fetchData(path, requestContext, params);
    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { data } = useLoaderData();
    const Component = PageRenderer.resolve('category').component;
    return <Component data={data} />;
};
