import { HeadersFunction, json, LoaderFunction, MetaFunction, Response } from '@remix-run/node';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { useLoaderData } from '@remix-run/react';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import Product from '~/ui/pages/Product';
import Category from '~/ui/pages/Category';
import AbstractStory from '~/ui/pages/AbstractStory';
import Topic from '~/ui/pages/Topic';
import LandingPage from '~/ui/pages/LandingPage';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import Stories from '~/ui/pages/Stories';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { shared, secret } = await getStoreFront(requestContext.host);
    const path = '/' + params['*'];
    const crystallizePath = path.replace('.pdf', '');
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
        isPreview: requestContext.isPreview,
    });
    const map = await api.fetchTreeMap();
    const mappedKey = Object.keys(map).find((key: string) => key === crystallizePath);
    if (!mappedKey) {
        throw new Response('Not Found', {
            status: 404,
        });
    }

    const shapeIdentifier = map[mappedKey as keyof typeof map]?.shape?.identifier || '_topic';
    const data = await dataFetcherForShapePage(shapeIdentifier, path, requestContext, params);

    return json(
        { shapeIdentifier, data },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { data, shapeIdentifier } = useLoaderData();
    switch (shapeIdentifier) {
        case 'product':
            return <Product data={data} />;
        case 'category':
            return <Category data={data} />;
        case 'folder':
            return <Stories folder={data} />;
        case 'abstract-story':
        case 'story':
        case 'curated-product-story':
            return <AbstractStory data={data} />;
        case '_topic':
            return <Topic data={data} />;
        case 'landing-page':
            return <LandingPage data={data} />;
        default:
            return <p>There is no renderer for that page</p>;
    }
};
