import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { ServiceAPI } from '~/core/use-cases/service-api';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared } = await getStoreFront(request.headers.get('Host')!);
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('30s', '30s', ['orders'], shared.config));
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any | null>(null);
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                setOrders(await ServiceAPI.fetchOrders());
            } catch (exception) {
                console.log(exception);
            }
        })();
    }, []);
    return (
        <div>
            <h1>My Orders</h1>

            <ul>
                {orders &&
                    orders.map((order: any, index: number) => (
                        <li key={order.id}>
                            <Link to={'/order/' + order.id}>#{order.id}</Link>
                        </li>
                    ))}
            </ul>
        </div>
    );
}
