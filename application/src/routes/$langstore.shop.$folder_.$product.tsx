import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import {
    HeadersFunction,
    json,
    LinksFunction,
    LoaderFunction,
    LoaderFunctionArgs,
    MetaFunction,
} from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getStoreFront } from '~/use-cases/storefront.server';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import { getContext } from '~/use-cases/http/utils';
import Product from '~/ui/pages/Product';
import dataFetcherForShapePage from '~/use-cases/dataFetcherForShapePage.server';
import videoStyles from '@crystallize/reactjs-components/assets/video/styles.css';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';
import type { Product as ProductType } from '~/use-cases/contracts/Product';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(
        (
            data as {
                data: {
                    product: ProductType;
                    preSelectedSku: string;
                };
            }
        )?.data,
    );
};

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: videoStyles }];
};

export const loader: LoaderFunction = async ({ request, params }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared } = await getStoreFront(requestContext.host);
    const user = await authenticatedUser(request);

    const data = await dataFetcherForShapePage('product', path, requestContext, params, marketIdentifiersForUser(user));
    return json({ data }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { data } = useLoaderData<typeof loader>();
    return <Product data={data} />;
};
