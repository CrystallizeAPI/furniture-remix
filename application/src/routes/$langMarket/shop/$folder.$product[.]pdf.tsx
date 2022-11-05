import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { getContext } from '~/core-server/http-utils.server';
import PageRenderer from '~/core/pages/index';
import { SingleProduct } from '~/core/components/pdf/single-product';

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared } = await getStoreFront(requestContext.host);
    const shapeIdentifier = 'product';
    const renderer = PageRenderer.resolve(shapeIdentifier, requestContext, params);
    const data = await renderer.fetchData(path, requestContext, params);
    const pdf = await ReactPDF.renderToStream(<SingleProduct product={data.product} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
