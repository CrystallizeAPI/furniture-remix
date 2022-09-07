import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';

import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { getHost } from '~/core-server/http-utils.server';
import { Folder } from '~/core/components/pdf/folder';
import { loader as FolderLoader } from './$folder';

export const loader: LoaderFunction = async ({ request, params, context }) => {
    const data = await FolderLoader({ request, params, context });
    const { folder, products } = await data.json();
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(getHost(request));
    const pdf = await ReactPDF.renderToStream(<Folder folder={folder} products={products} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
