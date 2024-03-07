import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/use-cases/storefront.server';
import { getContext } from '~/use-cases/http/utils';
import { Folder } from '~/ui/components/pdf/folder';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import { ProductSlim } from '~/use-cases/contracts/Product';
import { Category } from '~/use-cases/contracts/Category';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);
    const path = `/shop/${params.folder}`;
    const { shared } = await getStoreFront(requestContext.host);
    const user = await authenticatedUser(request);

    const data = (await dataFetcherForShapePage(
        'category',
        path,
        requestContext,
        params,
        marketIdentifiersForUser(user),
    )) as {
        products: ProductSlim[];
        category: Category;
    };
    const { products, category } = data;
    const pdf = await ReactPDF.renderToStream(<Folder category={category} products={products} />);

    let body: Buffer = await new Promise((resolve, reject) => {
        let chunks: Buffer[] = [];
        pdf.on('data', (chunk) => {
            chunks.push(chunk);
        });
        pdf.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        pdf.on('error', (error) => {
            reject(error);
        });
    });
    let headers = new Headers({
        ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier).headers,
        'Content-Type': 'application/pdf',
    });
    return new Response(body, {
        status: 200,
        headers,
    });
};
