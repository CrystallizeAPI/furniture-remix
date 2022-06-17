import { Link } from '@remix-run/react';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useLocalCart } from '../hooks/useLocalCart';
import { Image } from '@crystallize/reactjs-components/dist/image';
import trashIcon from '~/assets/trashIcon.svg';
import { DisplayPrice, Price as CrystallizePrice } from '~/lib/pricing/pricing-component';
import { getCurrencyFromCode } from '~/lib/pricing/currencies';

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

const DiscountsDebug: React.FC<{ discounts: DiscountLot[] }> = ({ discounts }) => {
    return (
        <div className="">
            <h6>DEBUG</h6>
            {discounts.map((discount: DiscountLot, index: number) => {
                const {
                    discount: { identifier },
                    items,
                } = discount;
                return (
                    <div key={index}>
                        <h5>
                            Discount <strong>{identifier}</strong> is applied
                        </h5>
                        {Object.keys(items).map((sku: string) => {
                            const item = items[sku];
                            return (
                                <p key={`${index}-${sku}`}>
                                    You get {item.quantity} {sku} for free. You saved €{item.quantity * item.price}
                                </p>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export const HydratedCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { isImmutable, isEmpty, add: addToCart, remove: removeFromCart } = useLocalCart();
    const { cart, total } = remoteCart?.cart || { cart: null, total: null };
    const { lots, savings } = remoteCart?.extra?.discounts || { lots: null, savings: null };

    if (isEmpty()) {
        return (
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
                    {cart &&
                        cart.items.map((item: any, index: number) => {
                            const saving = savings[item.variant.sku]?.quantity > 0 ? savings[item.variant.sku] : null;
                            return (
                                <div
                                    key={index}
                                    className="flex justify-between bg-grey2 py-5 pr-10 pl-5 items-center rounded-lg "
                                >
                                    <div className="flex cart-item gap-3 items-center">
                                        <Image {...item.variant.images?.[0]} sizes="100px" loading="lazy" />
                                        <div className="flex flex-col">
                                            <p className="text-xl font-semibold w-full">{item.product.name}</p>
                                            <p>
                                                <CrystallizePrice currencyCode="EUR">
                                                    {item.variantPrice.price}
                                                </CrystallizePrice>
                                                x{item.quantity}{' '}
                                                <CrystallizePrice currencyCode="EUR">
                                                    {item.price.gross}
                                                </CrystallizePrice>
                                                {saving && (
                                                    <>
                                                        <del className="text-red">
                                                            <CrystallizePrice currencyCode="EUR">
                                                                {item.price.gross + saving.amount}
                                                            </CrystallizePrice>
                                                        </del>
                                                        <small>({saving.quantity} for free!)</small>
                                                    </>
                                                )}
                                            </p>
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
                    {lots && <DiscountsDebug discounts={lots} />}
                    {total && (
                        <div className="flex flex-col gap-2 border-b-2 border-grey4 py-4 items-end">
                            <div className="flex text-grey3 text-sm justify-between w-60">
                                <p>Net</p>
                                <p>
                                    <CrystallizePrice currencyCode="EUR">{total.net}</CrystallizePrice>
                                </p>
                            </div>
                            <div className="flex text-grey3 text-sm justify-between w-60">
                                <p>Tax amount</p>
                                <p>
                                    <CrystallizePrice currencyCode="EUR">{total.taxAmount}</CrystallizePrice>
                                </p>
                            </div>
                            <div className="flex font-bold mt-2 text-lg justify-between w-60">
                                <p>To pay</p>
                                <p>
                                    <DisplayPrice
                                        price={{
                                            default: total.gross + total.discounts[0].amount,
                                            discounted: total.gross,
                                            percent: Math.round(
                                                ((total.gross + total.discounts[0].amount - total.gross) /
                                                    (total.gross + total.discounts[0].amount)) *
                                                    100,
                                            ),
                                            currency: getCurrencyFromCode('EUR'),
                                        }}
                                    />
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
