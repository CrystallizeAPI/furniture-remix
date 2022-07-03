import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { getStoreFront } from '~/core-server/storefront.server';
import { HydratedCart } from '~/core/components/cart';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { getHost } from '~/core-server/http-utils.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { secret: storefront, shared } = await getStoreFront(getHost(request));
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['cart'], shared.config));
};

export default () => {
    return (
        <div className="lg:w-content mx-auto w-full min-h-[90vh]">
            <HydratedCart />
        </div>
    );
};
