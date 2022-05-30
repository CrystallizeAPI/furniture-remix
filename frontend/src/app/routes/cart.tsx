import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { HydratedCart } from '~/core/components/cart';
import { HttpCacheHeaderTaggerFromLoader, SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const superFast = await getSuperFast(request.headers.get('Host')!);
    return json({}, SuperFastHttpCacheHeaderTagger('30s', '30s', ['cart'], superFast.config));
};

export default function Cart() {
    return (
        <div className="lg:w-content mx-auto w-full">
            <HydratedCart />
        </div>
    );
}
