import { json, LoaderFunction, HeadersFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { HttpCacheHeaderTagger, HttpCacheHeaderTaggerFromLoader } from '~/core/Http-Cache-Tagger';
import { fetchOrder } from '~/core/UseCases';

export const loader: LoaderFunction = async ({ params }) => {
    return json({ orderId: params.id }, HttpCacheHeaderTagger('30s', '1w', ['order' + params.id]));
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export default function Order() {
    const { orderId } = useLoaderData();
    const [tryCount, setTryCount] = useState(0);
    const [order, setOrder] = useState<any | null>(null);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                setOrder(await fetchOrder(orderId));
            } catch (exception) {
                timeout = setTimeout(() => {
                    setTryCount(tryCount + 1);
                }, 500 * tryCount);
            }
        })();
        return () => clearTimeout(timeout);
    }, [orderId, tryCount]);

    return (
        <div>
            <h1>Order #{orderId}</h1>

            {order && (
                <div>
                    <div>
                        <h1>Order Confirmation</h1>
                        <p>We've received your order #{order.id}.</p>
                        <div>
                            {order.cart.map((item: any, index: number) => {
                                return (
                                    <div key={index}>
                                        <div>
                                            <p>
                                                {item.name} x {item.quantity}
                                            </p>
                                        </div>
                                        <p>${item.price.gross * item.quantity}</p>
                                    </div>
                                );
                            })}
                            <div>
                                <div>
                                    <p>Subtotal</p>
                                    <p>${order.total.gross}</p>
                                </div>
                                <div>
                                    <p>Tax</p>
                                    <p>${order.total.net - order.total.gross}</p>
                                </div>
                                <div>
                                    <p>Total</p>
                                    <p>${order.total.net}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
