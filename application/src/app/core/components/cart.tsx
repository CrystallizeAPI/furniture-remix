import { Link } from '@remix-run/react';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useLocalCart } from '../hooks/useLocalCart';
import { Image } from '@crystallize/reactjs-components/dist/image';
import trashIcon from '~/assets/trashIcon.svg';
import { Price as CrystallizePrice } from '~/lib/pricing/pricing-component';
import { useAppContext } from '../app-context/provider';
import { CartItemPrice } from './price';
import { CartItem } from '@crystallize/node-service-api-request-handlers';

export const Cart: React.FC = () => {
    const { isEmpty } = useLocalCart();
    return (
        <div className="fixed rounded-md right-10 w-70 bottom-10 shadow-lg py-8 px-10 border border-[#dfdfdf] z-[999]">
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

export type DiscountLot = {
    items: Record<
        string,
        {
            price: number;
            sku: string;
            quantity: number;
        }
    >;
    discount: { identifier: string };
};
export type Savings = Record<string, { quantity: number; amount: number }>;

export const HydratedCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { isImmutable, isEmpty, add: addToCart, remove: removeFromCart } = useLocalCart();
    const { cart, total } = remoteCart?.cart || { cart: null, total: null };
    const { savings } = remoteCart?.extra?.discounts || { lots: null, savings: null };
    const { state: contextState } = useAppContext();

    if (isEmpty()) {
        return (
            <ClientOnly>
                <div className="min-h-[60vh] flex w-full flex-col gap-6 justify-center items-start ">
                    <div className="w-full flex items-center">
                        <div className="overflow-hidden w-[200px] ">
                            <div className="-ml-[50px]">
                                <iframe width="300px" src="https://embed.lottiefiles.com/animation/823" />
                            </div>
                        </div>
                        <div className="mt-10">
                            <div className="flex  pb-2 text-3xl font-semibold ">Woah, nothing in your cart yet</div>
                            <div className="flex w-full">
                                Try going back and find something beautiul before you come back
                            </div>
                            <button className="bg-grey mt-3 py-2 px-5 rounded-md text-center text-xl font-semibold">
                                <Link to="/">Back</Link>
                            </button>
                        </div>
                    </div>
                </div>
            </ClientOnly>
        );
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
                    {!cart && <OptimisticHydratedCart />}
                    {cart &&
                        cart.items.map((item: CartItem, index: number) => {
                            const saving = savings[item.variant.sku]?.quantity > 0 ? savings[item.variant.sku] : null;
                            return (
                                <div
                                    key={index}
                                    className="flex justify-between bg-grey2 py-5 pr-10 pl-5 items-center rounded-lg "
                                >
                                    <div className="flex cart-item gap-3 items-center">
                                        <Image {...item.variant.images?.[0]} sizes="100px" loading="lazy" />
                                        <div className="flex flex-col">
                                            <p className="text-xl font-semibold w-full">{item.variant.name}</p>
                                            <CartItemPrice item={item} saving={saving} />
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
                                                    <img src={trashIcon} width="25" height="25" alt="Trash icon" />
                                                ) : (
                                                    '-'
                                                )}{' '}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    {total && (
                        <div className="flex flex-col gap-2 border-b-2 border-grey4 py-4 items-end">
                            <div className="flex text-grey3 text-sm justify-between w-60">
                                <p>Discount</p>
                                <p>
                                    <CrystallizePrice currencyCode={contextState.currency.code}>
                                        {total.discounts.reduce((memo: number, discount: any) => {
                                            return memo + discount?.amount || 0;
                                        }, 0)}
                                    </CrystallizePrice>
                                </p>
                            </div>
                            <div className="flex text-grey3 text-sm justify-between w-60">
                                <p>Tax amount</p>
                                <p>
                                    <CrystallizePrice currencyCode={contextState.currency.code}>
                                        {total.taxAmount}
                                    </CrystallizePrice>
                                </p>
                            </div>
                            <div className="flex font-bold mt-2 text-lg justify-between w-60 items-end">
                                <p>To pay</p>
                                <p>
                                    <CrystallizePrice currencyCode={contextState.currency.code}>
                                        {total.gross}
                                    </CrystallizePrice>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-between mt-10">
                    <button className="bg-grey py-2 px-5 rounded-md text-center font-semibold">
                        <Link to="/">Back</Link>
                    </button>
                    <button className="bg-[#000] px-10 py-3 rounded text-[#fff] font-bold hover:bg-black-100">
                        <Link to="/checkout">Checkout</Link>
                    </button>
                </div>
            </div>
        </ClientOnly>
    );
};

export const OptimisticHydratedCart: React.FC = () => {
    const { cart: cart, isImmutable } = useLocalCart();
    const { state: contextState } = useAppContext();
    let total = 0;
    return (
        <>
            {Object.keys(cart.items).map((sku: string, index: number) => {
                const item = cart.items[sku as keyof typeof cart];
                total += item.quantity * item.price;
                return (
                    <div key={index} className="flex justify-between bg-grey2 py-5 pr-10 pl-5 items-center rounded-lg ">
                        <div className="flex cart-item gap-3 items-center">
                            <Image sizes="100px" loading="lazy" />
                            <div className="flex flex-col">
                                <p className="text-xl font-semibold w-full">{item.name}</p>
                                <CrystallizePrice currencyCode={contextState.currency.code}>
                                    {item.price}
                                </CrystallizePrice>
                            </div>
                        </div>
                        <div className="flex flex-col w-[40px] items-center justify-center gap-3">
                            {!isImmutable() && (
                                <button className="font-semibold w-[25px] h-[25px] rounded-sm" disabled>
                                    {' '}
                                    +{' '}
                                </button>
                            )}

                            <p className="text-center font-bold ">{item.quantity}</p>
                            {!isImmutable() && (
                                <button className="font-semibold w-[25px] h-[25px] rounded-sm" disabled>
                                    {' '}
                                    {item.quantity === 1 ? (
                                        <img src={trashIcon} width="25" height="25" alt="Trash icon" />
                                    ) : (
                                        '-'
                                    )}{' '}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
            <div className="flex flex-col gap-2 border-b-2 border-grey4 py-4 items-end">
                <div className="flex text-grey3 text-sm justify-between w-60">
                    <p>Discount</p>
                    <p>
                        <div className="loader" />
                    </p>
                </div>
                <div className="flex text-grey3 text-sm justify-between w-60">
                    <p>Tax amount</p>
                    <p>
                        <div className="loader" />
                    </p>
                </div>
                <div className="flex font-bold mt-2 text-lg justify-between w-60 items-end">
                    <p>To pay</p>
                    <p>
                        <CrystallizePrice currencyCode={contextState.currency.code}>{total}</CrystallizePrice>
                    </p>
                </div>
            </div>
        </>
    );
};
