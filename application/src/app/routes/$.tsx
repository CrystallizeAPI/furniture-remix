import { HeadersFunction, json, LoaderFunction, MetaFunction, Response } from '@remix-run/node';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { getHost, getLocale, isPreview } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import PageRenderer from '~/core/pages/index';
import { useLoaderData } from '@remix-run/react';
import { buildMetas } from '~/core/MicrodataBuilder';
import ReactPDF from '@react-pdf/renderer';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const { shared, secret } = await getStoreFront(getHost(request));
    const path = '/' + params['*'];
    const crystallizePath = path.replace('.pdf', '');
    const isPDF = path.endsWith('.pdf');
    const api = CrystallizeAPI(secret.apiClient, getLocale(request), isPreview(request));
    const map = await api.fetchTreeMap();
    const mappedKey = Object.keys(map).find((key: string) => key === crystallizePath);
    if (!mappedKey) {
        throw new Response('Not Found', {
            status: 404,
        });
    }

    const shapeIdentifier = map[mappedKey as keyof typeof map]?.shape?.identifier || '_topic';
    const renderer = PageRenderer.resolve(shapeIdentifier, request, params);
    const data = await renderer.fetchData(crystallizePath, request, params);
    if (isPDF) {
        const Component = PageRenderer.resolve(shapeIdentifier).PdfComponent;
        const pdf = await ReactPDF.renderToStream(<Component data={data} />);
        return new Response(pdf, {
            headers: {
                ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier).headers,
                'Content-Type': 'application/pdf',
            },
        });
    }
    return json(
        { shapeIdentifier, data },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier),
    );
};

// There is a know issue here, the PDF is not rendered correctly with Spat Route... as we have a default component
export default () => {
    const { data, shapeIdentifier } = useLoaderData();
    const Component = PageRenderer.resolve(shapeIdentifier).component;
    return <Component data={data} />;
};
