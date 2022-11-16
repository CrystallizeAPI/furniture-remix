import { json, LoaderFunction, HeadersFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/core/storefront.server';
import { isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import Order from '~/ui/pages/Order';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return json(
        { orderId: params.id, isServerSideAuthenticated: await isServerSideAuthenticated(request) },

        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['order' + params.id], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { orderId, isServerSideAuthenticated } = useLoaderData();
    return <Order id={orderId} isServerSideAuthenticated={isServerSideAuthenticated} />;
};
