import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { MagickLoginForm } from '~/core/components/checkout-forms/magicklogin';
import { useAuth } from '~/core/hooks/useAuth';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { ServiceAPI } from '~/core/use-cases/service-api';
import { Price } from '~/lib/pricing/pricing-component';
import DefaultImage from '~/assets/defaultImage.svg';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared } = await getStoreFront(request.headers.get('Host')!);
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['orders'], shared.config));
};

export default () => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState<any | null>(null);

    let orderDate = (date: any) => {
        let newDate = new Date(date);
        return newDate.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    useEffect(() => {
        (async () => {
            try {
                setOrders(await ServiceAPI.fetchOrders());
            } catch (exception) {
                console.log(exception);
            }
        })();
    }, []);

    return (
        <div className="container 2xl px-6 mx-auto w-full">
            {isAuthenticated ? (
                <>
                    <h1 className="text-2xl font-semibold my-10">Your Orders</h1>
                    <div>
                        {orders &&
                            orders.map((order: any, index: number) => (
                                <div key={order.id} className="border-2 border-grey my-5">
                                    <div className="w-full h-30 bg-[#F0F2F2] px-5 py-2 flex flex-wrap justify-between items-center">
                                        <div className="order-item">
                                            <span>Order placed</span>
                                            <p className="text-grey6">{orderDate(order.createdAt)}</p>
                                        </div>
                                        <div className="order-item">
                                            <span>Order ID</span>
                                            <p className="text-grey6">{order.id}</p>
                                        </div>
                                        <div className="order-item">
                                            <span>Total</span>
                                            <p className="text-grey6">
                                                <Price currencyCode={order.total.currency}>{order.total.gross}</Price>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col gap-5">
                                        {order.cart.map((item: any, index: number) => (
                                            <div key={index} className="flex justify-between items-center order-item">
                                                <div className="flex gap-3 items-center">
                                                    <img
                                                        src={item.imageUrl ? item.imageUrl : DefaultImage}
                                                        width="40px"
                                                        height="40px"
                                                        alt="product"
                                                    />
                                                    <p className="w-40">{item.name}</p>
                                                </div>
                                                <p className="w-20">{item.quantity}</p>
                                                <p className="w-20 text-right">
                                                    {/* adding because orders aren't returning currency, will be fixed */}
                                                    <Price currencyCode={item.price.currency || 'EUR'}>
                                                        {item.price.gross}
                                                    </Price>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </>
            ) : (
                <div className="min-h-[70vh] items-center justify-center flex max-w-[500px] mx-auto">
                    <div className="mx-auto items-center justify-center flex w-full ">
                        <MagickLoginForm title="Login" onlyLogin actionTitle="Login" />
                    </div>
                </div>
            )}
        </div>
    );
};
