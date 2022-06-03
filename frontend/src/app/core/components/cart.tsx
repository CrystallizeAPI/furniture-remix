import { Link } from '@remix-run/react';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useLocalCart } from '../hooks/useLocalCart';
import { Image } from '@crystallize/reactjs-components/dist/image';
import trashIcon from '~/assets/trashIcon.svg';

export const Cart: React.FC = () => {
    const { isEmpty } = useLocalCart();
    return (
        <div className="fixed rounded-md bottom-10 right-10 w-70 shadow-lg py-8 px-10 border border-[#dfdfdf]">
            <ClientOnly fallback={<p>Your basket is empty.</p>}>
                <>
                    {!isEmpty() && (
                        <>
                            <h5>Yay! Item added to cart 🎉</h5>

                            <div className="flex gap-3 mt-3 items-center">
                                <button className="bg-textBlack text-[#fff] py-2 px-4 rounded-md">
                                    <Link to={'/cart'}>Go to cart</Link>
                                </button>
                                <button className="underline">
                                    {' '}
                                    <Link to={'/checkout'}>Continue to checkout</Link>
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
    // const { cart, total } = remoteCart || { cart: null, total: null };
    const { cart } = remoteCart || { cart: null };
    const { total } = cart || { total: null };
    if (isEmpty()) {
        return null;
    }

    return (
        <ClientOnly>
            <div className="mt-10 rounded p-10  mx-auto">
                <div className="flex mb-4 justify-between">
                    <h1 className="font-bold text-2xl">Cart</h1>
                    {loading && (
                        <div className="flex items-center">
                            <span className="pr-2">Loading...</span>
                            <div className="loader" />
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-3 min-h-[200px] ">
                    {cart &&
                        cart.cart.items.map((item: any, index: number) => (
                            <div
                                key={index}
                                className="flex justify-between bg-grey2 py-5 pr-10 pl-5 items-center rounded-lg "
                            >
                                <div className="flex cart-item gap-3 items-center">
                                    <Image {...item.variant.images?.[0]} sizes="100px" loading="lazy" />
                                    <div className="flex flex-col">
                                        <p className="text-xl font-semibold w-full">{item.product.name}</p>
                                        <p>€{item.price.gross}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col w-[40px] items-center justify-center gap-3">
                                    {!isImmutable() && (
                                        <button
                                            className="font-semibold w-[25px] h-[25px] rounded-sm"
                                            onClick={() => {
                                                addToCart(item.variant);
                                            }}
                                        >
                                            {' '}
                                            +{' '}
                                        </button>
                                    )}

                                    <p className="text-center font-bold ">{item.quantity}</p>
                                    {!isImmutable() && (
                                        <button
                                            className="font-semibold w-[25px] h-[25px] rounded-sm"
                                            onClick={() => {
                                                removeFromCart(item.variant);
                                            }}
                                        >
                                            {' '}
                                            {item.quantity === 1 ? (
                                                <img src={trashIcon} width="25" height="25" alt="Trash icon " />
                                            ) : (
                                                '-'
                                            )}{' '}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    {total && (
                        <div className="flex flex-col gap-2 border-b-2 border-grey4 py-4 items-end">
                            <div className="flex text-grey3 text-sm justify-between w-60">
                                <p>Net</p>
                                <p>€ {total.net}</p>
                            </div>
                            <div className="flex text-grey3 text-sm justify-between w-60">
                                <p>Tax amount</p>
                                <p>€ {total.taxAmount}</p>
                            </div>
                            <div className="flex font-bold mt-2 text-lg justify-between w-60">
                                <p>To pay</p>
                                <p>€ {total.gross}</p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-between mt-10">
                    <button className="bg-grey py-2 px-5 rounded-md text-center font-semibold">
                        <Link to="/">Back</Link>
                    </button>
                    <button className="bg-buttonBg2 py-2 rounded-md py-4 px-4 w-40 text-center font-bold hover:bg-pink">
                        <Link to="/checkout">Checkout</Link>
                    </button>
                </div>
            </div>
        </ClientOnly>
    );
};
