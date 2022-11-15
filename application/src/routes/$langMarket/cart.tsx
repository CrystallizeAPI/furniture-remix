import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { getStoreFront } from '~/core-server/storefront.server';
import { HydratedCart } from '~/core/components/cart';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['cart'], shared.config.tenantIdentifier));
};

export default () => {
    return (
        <div className="lg:w-content mx-auto w-full min-h-[90vh]">
            <HydratedCart />
        </div>
    );
};
