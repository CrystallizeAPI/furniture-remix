import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';

import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { getHost } from '~/core-server/http-utils.server';

import { Folder } from '~/core/components/pdf/folder';

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);

    const path = `/shop/${params.folder}`;
    const { shared, secret } = await getStoreFront(getHost(request));
    const api = CrystallizeAPI(secret.apiClient, 'en', new URL(request.url).searchParams?.has('preview'));
    const searchParams = {
        orderBy: url.searchParams.get('orderBy'),
        filters: {
            price: {
                min: url.searchParams.get('min'),
                max: url.searchParams.get('max'),
            },
        },
        attributes: url.searchParams.getAll('attr'),
    };

    const [folder, products] = await Promise.all([
        api.fetchFolder(path),
        api.searchOrderBy(path, searchParams.orderBy, searchParams.filters, searchParams.attributes),
    ]);
    if (!folder || !products) {
        throw new Response('Folder Not Found', {
            status: 404,
            statusText: 'Folder Not Found',
        });
    }

    const pdf = await ReactPDF.renderToStream(<Folder folder={folder} products={products} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
