import { Link } from '@remix-run/react';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useLocalCart } from '../hooks/useLocalCart';
import { Image } from '@crystallize/reactjs-components/dist/image';

export const Cart: React.FC = () => {
    const { isEmpty } = useLocalCart();
    return (
        <div className="absolute bottom-10 right-10 w-70 shadow-md py-4 px-6 border-2">
            <ClientOnly fallback={<p>Your basket is empty.</p>}>
                <>
                    {!isEmpty() && (
                        <>
                            <h5>Yay! Item added to cart 🎉</h5>

                            <div className="flex gap-3 mt-3 items-center">
                                <button className="bg-textBlack text-[#fff] py-2 px-4 rounded-md">
                                    <Link to={'/cart'}>See the cart</Link>
                                </button>
                                <button className="underline">
                                    {' '}
                                    <Link to={'/checkout'}>Place the order</Link>
                                </button>
                            </div>
                        </>
                    )}
                </>
            </ClientOnly>
        </div>
    );
};

const InnerCart: React.FC<{ basket: any }> = ({ basket }) => {
    return (
        <ul>
            {basket &&
                Object.keys(basket.items).map((key: string) => {
                    const item: any = basket.items[key as keyof typeof basket.items];
                    return (
                        <li key={key + item.quantity}>
                            {item.name} - x{item.quantity}
                        </li>
                    );
                })}
        </ul>
    );
};

export const HydratedCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { isImmutable, isEmpty, add: addToCart, remove: removeFromCart } = useLocalCart();
    const { cart, total } = remoteCart || { cart: null, total: null };

    if (isEmpty()) {
        return null;
    }

    return (
        <ClientOnly>
            <div className="mt-10 rounded p-10  mx-auto">
                {loading && <p>Loading...</p>}
                <h1 className="font-bold text-4xl mt-5 mb-10">Cart</h1>
                <div className="flex flex-col gap-3">
                    {cart &&
                        cart.cart.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between bg-grey2 p-5 items-center">
                                <div className="flex cart-item gap-3 items-center">
                                    <Image {...item.variant.images?.[0]} sizes="100px" loading="lazy" />
                                    <div className="flex flex-col">
                                        <p className="text-xl font-semibold w-full">
                                            {item.product.name} × {item.quantity}
                                        </p>
                                        <p>€{item.price.gross * item.quantity}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {!isImmutable() && (
                                        <button
                                            onClick={() => {
                                                removeFromCart(item.variant);
                                            }}
                                        >
                                            {' '}
                                            -{' '}
                                        </button>
                                    )}
                                    <p>{item.quantity}</p>
                                    {!isImmutable() && (
                                        <button
                                            onClick={() => {
                                                addToCart(item.variant);
                                            }}
                                        >
                                            {' '}
                                            +{' '}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    {total && (
                        <div className="flex flex-col gap-4 border-b-2 border-grey4 py-4 items-end">
                            <div className="flex text-grey3 justify-between w-60">
                                <p>Net</p>
                                <p>€ {total.net}</p>
                            </div>
                            <div className="flex text-grey3 justify-between w-60">
                                <p>Tax amount</p>
                                <p>€ {total.taxAmount}</p>
                            </div>
                            <div className="flex font-bold text-xl justify-between w-60">
                                <p>To pay</p>
                                <p>€ {total.gross}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-between mt-10">
                        <button className="bg-grey py-2 px-5 text-center font-semibold">
                            <Link to="/">Back</Link>
                        </button>
                        <button className="bg-buttonBg2 py-2 px-4 w-40 text-center font-bold hover:bg-pink">
                            <Link to="/checkout">Checkout</Link>
                        </button>
                    </div>
                </div>
            </div>
        </ClientOnly>
    );
};
