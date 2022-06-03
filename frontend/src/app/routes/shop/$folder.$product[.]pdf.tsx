import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { SingleProduct } from '~/core/components/pdf/single-product';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { getStoreFront } from '~/core/storefront/storefront.server';

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    const product = await CrystallizeAPI.fetchProduct(secret.apiClient, path, version);
    const pdf = await ReactPDF.renderToStream(<SingleProduct product={product} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('30s', '30s', [path], shared.config).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
