import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { getStoreFront } from '~/core/storefront.server';
import { getContext } from '~/use-cases/http/utils';
import { isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import { useLoaderData } from '@remix-run/react';
import { privateJson } from '~/core/bridge/privateJson.server';
import Checkout from '~/ui/pages/Checkout';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return privateJson(
        { isServerSideAuthenticated: await isServerSideAuthenticated(request) },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['checkout'], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { isServerSideAuthenticated } = useLoaderData();
    return <Checkout isServerSideAuthenticated={isServerSideAuthenticated} />;
};
