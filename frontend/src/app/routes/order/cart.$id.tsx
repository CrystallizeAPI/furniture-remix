import { json, LoaderFunction, HeadersFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { SuperFastHttpCacheHeaderTagger, HttpCacheHeaderTaggerFromLoader } from '~/core/Http-Cache-Tagger';
import { fetchCart } from '~/core/UseCases';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const superFast = await getSuperFast(request.headers.get('Host')!);
    return json(
        { cartId: params.id },
        SuperFastHttpCacheHeaderTagger('30s', '30s', ['cart' + params.id], superFast.config),
    );
};

export default function CartPlaced() {
    const { cart: localCart, empty } = useLocalCart();
    const { cartId } = useLoaderData();
    const [tryCount, setTryCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                if (localCart.cartId === cartId) {
                    empty();
                }
                const cart = await fetchCart(cartId);
                if (cart?.extra?.orderId) {
                    navigate('/order/' + cart.extra.orderId);
                } else {
                    timeout = setTimeout(() => {
                        setTryCount(tryCount + 1);
                    }, 500 * tryCount);
                }
            } catch (exception) {
                timeout = setTimeout(() => {
                    setTryCount(tryCount + 1);
                }, 500 * tryCount);
            }
        })();
        return () => clearTimeout(timeout);
    }, [cartId, tryCount]);

    return (
        <div>
            <h1>Cart #{cartId} Placed!</h1>
            <div>
                <div>
                    <h1>Cart</h1>
                    <p>Your cart has been placed successfully, we're waiting for payment confirmation.</p>
                    <p>Redirecting....</p>
                </div>
            </div>
        </div>
    );
}
