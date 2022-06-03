import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { HydratedCart } from '~/core/components/cart';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared } = await getStoreFront(request.headers.get('Host')!);
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('30s', '30s', ['cart'], shared.config));
};

export default function Cart() {
    return (
        <div className="lg:w-content mx-auto w-full">
            <HydratedCart />
        </div>
    );
}
