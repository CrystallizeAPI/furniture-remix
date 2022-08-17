import { json, LoaderFunction, HeadersFunction } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { ServiceAPI } from '~/use-cases/service-api';
import { getHost } from '~/core-server/http-utils.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const { shared } = await getStoreFront(getHost(request));
    return json(
        { cartId: params.id },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['cart' + params.id], shared.config),
    );
};

export default () => {
    const { cart: localCart, empty } = useLocalCart();
    const { cartId } = useLoaderData();
    const [tryCount, setTryCount] = useState(0);
    const navigate = useNavigate();

    const [orderGuestId, setOrderGuestId] = useState('');

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                if (localCart.cartId === cartId) {
                    empty();
                }
                const cart = await ServiceAPI.fetchCart(cartId);
                if (cart?.extra?.orderId) {
                    if (cart?.customer?.isGuest === true) {
                        setOrderGuestId(cart.extra.orderId);
                    } else {
                        navigate('/order/' + cart.extra.orderId);
                    }
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

    if (orderGuestId !== '') {
        return (
            <div className="min-h-[80vh] items-center flex lg:w-content mx-auto w-full">
                <div className="w-2/4 mx-auto">
                    <h1 className="font-bold text-3xl mb-2">Order Placed!</h1>
                    <div>
                        <div>
                            <p>
                                Your order has been placed successfully, as it is a Guest Order you won't see the
                                details here.
                            </p>
                            <p className="mt-4 text-[#6D6B69]">
                                Order id: <span className="font-italic">{orderGuestId}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] items-center flex lg:w-content mx-auto w-full">
            <div className="w-2/4 mx-auto">
                <h1 className="font-bold text-3xl mb-2">Cart Placed!</h1>
                <div>
                    <div>
                        <p>Your cart has been placed successfully, we're waiting for payment confirmation.</p>
                        <p className="mt-4 text-[#6D6B69]">
                            Id: <span className="font-italic">{cartId}</span>
                        </p>
                        <div className="mt-4 flex gap-2">
                            <div className="loader " />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
