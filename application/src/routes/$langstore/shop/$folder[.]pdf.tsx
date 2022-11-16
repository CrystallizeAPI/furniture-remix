import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';

import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/core/storefront.server';
import { getContext } from '~/use-cases/http/utils';
import PageRenderer from '~/ui/pages/index';
import { Folder } from '~/ui/components/pdf/folder';

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(requestContext.host);
    const shapeIdentifier = 'category';
    const renderer = PageRenderer.resolve(shapeIdentifier, requestContext, params);
    const data = await renderer.fetchData(path, requestContext, params);
    const { products, category } = data;
    const pdf = await ReactPDF.renderToStream(<Folder category={category} products={products} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
