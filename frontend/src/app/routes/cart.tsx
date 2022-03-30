import { HeadersFunction } from 'remix';
import { HydratedBasket } from '~/core/components/Bastket';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';

export const headers: HeadersFunction = () => {
    return HttpCacheHeaderTagger("1m", "1w", ["cart"]).headers;
}

export default function Cart() {

    return (
        <div>
            <h1>CART</h1>
            <HydratedBasket />
        </div >
    );
}
