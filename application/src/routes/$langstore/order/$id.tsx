import { json, LoaderFunction, HeadersFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import Order from '~/ui/pages/Order';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);

    let cartId = requestContext.url.searchParams.get('cartId');

    return json(
        {
            orderId: params.id,
            cartId,
        },

        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['order' + params.id], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { orderId, cartId } = useLoaderData();
    return <Order id={orderId} cartId={cartId} />;
};
