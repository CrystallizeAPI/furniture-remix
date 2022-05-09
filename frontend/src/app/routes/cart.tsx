
import { HeadersFunction } from '@remix-run/node';
import { HydratedCart } from '~/core/components/cart';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';

export const headers: HeadersFunction = () => {
    return HttpCacheHeaderTagger("1m", "1w", ["cart"]).headers;
}

export default function Cart() {

    return (
        <div className="lg:w-content mx-auto w-full">
            <HydratedCart />
        </div >
    );
}
