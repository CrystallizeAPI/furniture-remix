import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';

import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { getHost } from '~/core-server/http-utils.server';
import PageRenderer from '~/core/pages/index';

export const loader: LoaderFunction = async ({ request, params }) => {
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(getHost(request));
    const shapeIdentifier = 'category';
    const renderer = PageRenderer.resolve(shapeIdentifier, request, params);
    const data = await renderer.fetchData(path, request, params);
    const Component = PageRenderer.resolve(shapeIdentifier).PdfComponent;
    const pdf = await ReactPDF.renderToStream(<Component data={data} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
