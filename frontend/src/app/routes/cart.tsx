import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { HydratedCart } from '~/core/components/cart';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared } = await getStoreFront(request.headers.get('Host')!);
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['cart'], shared.config));
};

export default () => {
    return (
        <div className="lg:w-content mx-auto w-full">
            <HydratedCart />
        </div>
    );
};
