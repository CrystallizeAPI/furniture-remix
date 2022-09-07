import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { SingleProduct } from '~/core/components/pdf/single-product';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { getHost } from '~/core-server/http-utils.server';
import { loader as ProductLoader } from './$folder.$product';

export const loader: LoaderFunction = async ({ request, params, context }) => {
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared, secret } = await getStoreFront(getHost(request));
    const data = await ProductLoader({ request, params, context });
    const { product } = await data.json();

    const pdf = await ReactPDF.renderToStream(<SingleProduct product={product} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
