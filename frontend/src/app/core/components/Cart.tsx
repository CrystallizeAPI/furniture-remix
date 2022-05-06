import { Link } from '@remix-run/react';
import { useAuth } from '../hooks/useAuth';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useLocalCart } from '../hooks/useLocalCart';

const styles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    border: '2px solid red',
    padding: '5px',
}

export const Basket: React.FC = () => {
    const { isEmpty, cart } = useLocalCart();
    const { isAuthenticated, userInfos } = useAuth();
    return <div style={styles}>
        <ClientOnly fallback={<p>Your basket is empty.</p>}><>
            {(() => {
                if (isAuthenticated) {
                    return <>
                        <p>Hello {userInfos.firstname} {userInfos.lastname}</p>
                        <p><Link to='/orders'>My Orders</Link></p>
                    </>;
                }
                return <></>;
            })()}
            {!isEmpty() && (<>
                <h5>Basket (Id:{cart.cartId}, State: {cart.state})</h5>
                <InnerBasket basket={cart} />
                <p>
                    <Link to={'/cart'}>See the cart</Link><br />
                    <Link to={'/checkout'}>Place the order</Link>
                </p>
            </>)}</>
        </ClientOnly>
    </div>
};

const InnerBasket: React.FC<{ basket: any }> = ({ basket }) => {
    return <ul>
        {basket && Object.keys(basket.items).map((key: string) => {
            const item: any = basket.items[key as keyof typeof basket.items];
            return <li key={key + item.quantity}>{item.name} - x{item.quantity}</li>
        })}
    </ul>
}

export const HydratedBasket: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { isImmutable, cart: localCart, isEmpty, add: addToCart, remove: removeFromCart } = useLocalCart();
    const { cart, total } = remoteCart || { cart: null, total: null };

    if (isEmpty()) {
        return null;
    }

    return <ClientOnly><div style={{ backgroundColor: loading ? '#ddd' : 'transparent' }}>
        {loading && <p>Loading...</p>}
        <h2>Details (Id:{localCart.cartId}, State: {localCart.state})</h2>
        <table>
            <thead>
                <tr>
                    <th colSpan={2}>Name</th>
                    <th>Quantity</th>
                    <th colSpan={3}>Price</th>
                </tr>
                <tr>
                    <th>Variant Name</th>
                    <th>Product Name</th>
                    <th>&nbsp;</th>
                    <th>Gross</th>
                    <th>Net</th>
                    <th>Tax</th>
                </tr>
            </thead>
            <tbody>
                {cart && cart.cart.items.map((item: any) => {
                    return <tr key={item.variant.sku}>
                        <td>{item.variant.name}</td>
                        <td>{item.product.name}</td>
                        <td>
                            {!isImmutable() && <button onClick={() => { removeFromCart(item.variant); }}> - </button>}
                            {item.quantity}
                            {!isImmutable() && <button onClick={() => { addToCart(item.variant) }}> + </button>}
                        </td>
                        <td>{item.price.gross}</td>
                        <td>{item.price.net}</td>
                        <td>{item.price.taxAmount}</td>
                    </tr>;
                })}
            </tbody>
            {total && <tfoot>
                <tr>
                    <th colSpan={3}>Total</th>
                    <td>{total.gross}</td>
                    <td>{total.net}</td>
                    <td>{total.taxAmount}</td>
                </tr>
            </tfoot>}
        </table>
    </div>
    </ClientOnly>
};
