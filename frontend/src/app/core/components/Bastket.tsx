import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ClientOnly } from '../hooks/useHydrated';
import { useLocalBasket } from '../hooks/useLocalBasket';

const styles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    border: '2px solid red',
    padding: '5px',
}

export const Basket: React.FC = () => {
    const { basket } = useLocalBasket();
    const { isAuthenticated, userInfos } = useAuth();
    return <div style={styles}>
        <ClientOnly>{(() => {
            if (isAuthenticated) {
                return <p>Hello {userInfos.firstname} {userInfos.lastname}</p>;
            }
            return <></>;
        })()}</ClientOnly>
        <h5>Basket</h5>
        <ClientOnly fallback={<p>Your basket is empty.</p>}><InnerBasket basket={basket} /></ClientOnly>
        <p>
            <Link to={'/cart'}>See the cart</Link><br />
            <Link to={'/checkout'}>Place the order</Link>
        </p>
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
    const { cart, loading } = useCart();
    const { addToBasket, removeFromBasket } = useLocalBasket();

    return <div style={{ backgroundColor: loading ? '#ddd' : 'transparent' }}>
        {loading && <p>Loading...</p>}
        <h2>Details</h2>
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
                            <button onClick={() => { removeFromBasket(item.variant); }}> - </button>
                            {item.quantity}
                            <button onClick={() => { addToBasket(item.variant) }}> + </button>
                        </td>
                        <td>{item.price.gross}</td>
                        <td>{item.price.net}</td>
                        <td>{item.price.taxAmount}</td>
                    </tr>;
                })}
            </tbody>
            {cart && <tfoot>
                <tr>
                    <th colSpan={3}>Total</th>
                    <td>{cart.total.gross}</td>
                    <td>{cart.total.net}</td>
                    <td>{cart.total.taxAmount}</td>
                </tr>
            </tfoot>}
        </table>


    </div>
};
