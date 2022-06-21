import { json, LoaderFunction, HeadersFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { ServiceAPI } from '~/core/use-cases/service-api';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const { shared } = await getStoreFront(request.headers.get('Host')!);
    return json(
        { orderId: params.id },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['order' + params.id], shared.config),
    );
};

export default () => {
    const { orderId } = useLoaderData();
    const [tryCount, setTryCount] = useState(0);
    const [order, setOrder] = useState<any | null>(null);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                setOrder(await ServiceAPI.fetchOrder(orderId));
            } catch (exception) {
                timeout = setTimeout(() => {
                    setTryCount(tryCount + 1);
                }, 500 * tryCount);
            }
        })();
        return () => clearTimeout(timeout);
    }, [orderId, tryCount]);

    return (
        <div className="min-h-[70vh] items-center flex lg:w-content mx-auto w-full">
            {order && (
                <div className="w-3/4 mx-auto">
                    <div className="mt-10">
                        <h1 className="font-bold text-3xl">Order Confirmation</h1>
                        <p className="mt-4">We've received your order.</p>
                        <p> The order ID is: #{order.id}.</p>
                        <div className="mt-2">
                            {order.cart.map((item: any, index: number) => {
                                return (
                                    <div key={index} className="bg-grey2 px-3 py-2 mb-2 gap-2 flex items-center">
                                        <div className="img-container overflow-hidden rounded-md img-contain w-[50px] h-[70px]">
                                            <img src={item.imageUrl} />
                                        </div>
                                        <div className="flex w-full justify-between">
                                            <div>
                                                <p className="font-semibold">
                                                    {item.name} x {item.quantity}
                                                </p>
                                            </div>
                                            <p>€{item.price.gross * item.quantity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex flex-col gap-4 border-t-2 border-grey4 py-4 items-end px-4 mt-5">
                                <div className="flex text-grey3 justify-between w-60">
                                    <p>Net</p>
                                    <p>€ {order.total.net}</p>
                                </div>
                                <div className="flex text-grey3 justify-between w-60">
                                    <p>Tax amount</p>
                                    <p>€ {order.total.gross - order.total.net}</p>
                                </div>
                                <div className="flex font-bold text-xl justify-between w-60">
                                    <p>Paid</p>
                                    <p>€ {order.total.gross}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
