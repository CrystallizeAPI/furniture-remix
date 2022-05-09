import { Link } from '@remix-run/react';
import { useAuth } from '../hooks/useAuth';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useLocalCart } from '../hooks/useLocalCart';

const styles: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    border: '2px solid red',
    padding: '5px',
    backgroundColor: '#fff',
}

export const Cart: React.FC = () => {
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
                <InnerCart basket={cart} />
                <p>
                    <Link to={'/cart'}>See the cart</Link><br />
                    <Link to={'/checkout'}>Place the order</Link>
                </p>
            </>)}</>
        </ClientOnly>
    </div>
};

const InnerCart: React.FC<{ basket: any }> = ({ basket }) => {
    return <ul>
        {basket && Object.keys(basket.items).map((key: string) => {
            const item: any = basket.items[key as keyof typeof basket.items];
            return <li key={key + item.quantity}>{item.name} - x{item.quantity}</li>
        })}
    </ul>
}

export const HydratedCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { isImmutable, cart: localCart, isEmpty, add: addToCart, remove: removeFromCart } = useLocalCart();
    const { cart, total } = remoteCart || { cart: null, total: null };

    if (isEmpty()) {
        return null;
    }

    return <ClientOnly>
        <div className="bg-grey mt-10 rounded p-10  mx-auto" style={{ backgroundColor: loading ? '#ddd' : 'transparent' }}>
            {loading && <p>Loading...</p>}
            <h1 className="font-bold text-4xl mt-5 mb-10">Your cart<small>Details (Id:{localCart.cartId}, State: {localCart.state})</small></h1>
            <div className="flex flex-col">
                {cart &&
                    cart.cart.items.map((item: any) => (
                        <div key={item.id} className="flex justify-between">
                            <div className="flex flex-col">
                                <p className="text-xl">
                                    {!isImmutable() && <button onClick={() => { removeFromCart(item.variant); }}> - </button>}
                                    {item.product.name} ({item.variant.name}) × {item.quantity}
                                    {!isImmutable() && <button onClick={() => { addToCart(item.variant) }}> + </button>}
                                </p>
                            </div>
                            <p>${item.price.gross} (gross)</p>
                            <p>${item.price.net} (net)</p>
                            <p>${item.price.taxAmount} (taxAmount)</p>
                        </div>
                    ))}
                {total && (
                    <div className="flex justify-between items-center border-t-2 border-text pt-4">
                        <p className="font-semibold text-xl">Total</p>
                        <p>${total.gross} (gross)</p>
                        <p>${total.net} (net)</p>
                        <p>${total.taxAmount}(taxAmount)</p>

                    </div>
                )}
                <Link
                    to="/checkout"
                    className="py-3 mt-10 rounded font-semibold bg-buttonBg text-buttonText w-auto text-center"
                >
                    Go to Checkout
                </Link>
            </div>
        </div>
    </ClientOnly>
};
