import { HeadersFunction, json, LoaderFunction, MetaFunction, Response } from '@remix-run/node';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/core/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import PageRenderer from '~/ui/pages/index';
import { useLoaderData } from '@remix-run/react';
import { buildMetas } from '~/use-cases/MicrodataBuilder';

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
    const renderer = PageRenderer.resolve(shapeIdentifier, requestContext, params);
    const data = await renderer.fetchData(crystallizePath, requestContext, params);
    return json(
        { shapeIdentifier, data },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { data, shapeIdentifier } = useLoaderData();
    const Component = PageRenderer.resolve(shapeIdentifier).component;
    return <Component data={data} />;
};
