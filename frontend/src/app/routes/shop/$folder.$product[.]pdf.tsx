import { LoaderFunction, Response } from '@remix-run/node';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import ReactPDF from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { fetchProduct } from '~/core/UseCases';
import { SingleProduct } from '~/core/components/pdf/single-product';

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/shop/${params.folder}/${params.product}`;
    const superFast = await getSuperFast(request.headers.get('Host')!);
    const product = await fetchProduct(superFast.apiClient, path, version);

    const pdf = await ReactPDF.renderToStream(<SingleProduct product={product} />);
    return new Response(pdf, {
        headers: {
            ...SuperFastHttpCacheHeaderTagger('30s', '30s', [path], superFast.config).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
