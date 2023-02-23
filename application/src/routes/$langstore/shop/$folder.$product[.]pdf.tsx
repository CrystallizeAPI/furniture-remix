import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/use-cases/storefront.server';
import { getContext } from '~/use-cases/http/utils';
import { SingleProduct } from '~/ui/components/pdf/single-product';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import { Product } from '~/use-cases/contracts/Product';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared } = await getStoreFront(requestContext.host);
    const user = await authenticatedUser(request);
    const data = (await dataFetcherForShapePage(
        'product',
        path,
        requestContext,
        params,
        marketIdentifiersForUser(user),
    )) as {
        product: Product;
    };
    const pdf = await ReactPDF.renderToStream(<SingleProduct product={data.product} />);
    return new Response(pdf, {
        headers: {
            ...StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier).headers,
            'Content-Type': 'application/pdf',
        },
    });
};
