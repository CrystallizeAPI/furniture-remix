import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { HttpCacheHeaderTaggerFromLoader, SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { fetchOrders } from '~/core/UseCases';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const superFast = await getSuperFast(request.headers.get('Host')!);
    return json({}, SuperFastHttpCacheHeaderTagger('30s', '30s', ['orders'], superFast.config));
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
