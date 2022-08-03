import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { SingleProduct } from '~/core/components/pdf/single-product';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { getStoreFront } from '~/core-server/storefront.server';
import { getHost } from '~/core-server/http-utils.server';

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared, secret } = await getStoreFront(getHost(request));
    const product = await CrystallizeAPI.fetchProduct(secret.apiClient, path, version, 'en');
    if (!product) {
        throw new Response('Product Not Found', {
            status: 404,
            statusText: 'Product Not Found',
        });
    }
    const pdf = await ReactPDF.renderToStream(<SingleProduct product={product} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
