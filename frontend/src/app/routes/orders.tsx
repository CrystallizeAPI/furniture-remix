import { HeadersFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { fetchOrders } from '~/core/UseCases';

export const headers: HeadersFunction = () => {
    return HttpCacheHeaderTagger('1m', '1w', ['orders']).headers;
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any | null>(null);
    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                setOrders(await fetchOrders());
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
