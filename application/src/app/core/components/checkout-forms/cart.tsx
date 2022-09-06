import { useRemoteCart } from '~/core/hooks/useRemoteCart';
import { Image } from '@crystallize/reactjs-components/dist/image';
import { useAppContext } from '~/core/app-context/provider';
import { Price } from '~/lib/pricing/pricing-component';
import { CartItemPrice } from '../price';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { Price as CrystallizePrice } from '~/lib/pricing/pricing-component';

export const CheckoutCart: React.FC = () => {
    const { remoteCart } = useRemoteCart();
    const { cart, total } = remoteCart?.cart || { cart: null, total: null };
    const { savings } = remoteCart?.extra?.discounts || { lots: null, savings: null };
    const { state: contextState } = useAppContext();

    return (
        <div className="lg:w-2/5 w-full">
            <h1 className="font-bold text-2xl mt-10 mb-5">Your cart</h1>
            {!cart && <OptimisticHydratedCart />}
            {cart &&
                cart.items.map((item: any, index: number) => {
                    const saving = savings[item.variant.sku]?.quantity > 0 ? savings[item.variant.sku] : null;
                    return (
                        <div
                            key={index}
                            className="mt-2 min-h-[60px] rounded-md flex justify-between bg-grey2 p-2 items-center"
                        >
                            <div className="flex cart-item gap-3 items-center">
                                <div className="img-container img-contain w-[60px] h-[60px]">
                                    <Image {...item?.variant.images?.[0]} sizes="100px" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-md font-regular w-full">{item.variant.name}</p>
                                    <CartItemPrice item={item} saving={saving} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            {total && (
                <div className="flex flex-col gap-1  py-4 items-end">
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>Discount</p>
                        <p>
                            <Price currencyCode={contextState.currency.code}>
                                {total.discounts.reduce((memo: number, discount: any) => {
                                    return memo + discount?.amount || 0;
                                }, 0)}
                            </Price>
                        </p>
                    </div>
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>Tax amount</p>
                        <p>
                            <Price currencyCode={contextState.currency.code}>{total.taxAmount}</Price>
                        </p>
                    </div>
                    <div className="flex font-bold mt-2 text-lg justify-between w-60">
                        <p>To pay</p>
                        <p>
                            <Price currencyCode={contextState.currency.code}>{total.gross}</Price>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export const OptimisticHydratedCart: React.FC = () => {
    const { cart: cart } = useLocalCart();
    const { state: contextState } = useAppContext();
    let total = 0;
    return (
        <>
            {Object.keys(cart.items).map((sku: string, index: number) => {
                const item = cart.items[sku as keyof typeof cart];
                total += item.quantity * item.price;
                return (
                    <div
                        key={index}
                        className="mt-2 min-h-[60px] rounded-md flex justify-between bg-grey2 p-2 items-center"
                    >
                        <div className="flex cart-item gap-3 items-center">
                            <div className="img-container img-contain w-[60px] h-[60px]">
                                <Image />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-md font-regular w-full">{item.name}</p>
                                <CrystallizePrice currencyCode={contextState.currency.code}>
                                    {item.price}
                                </CrystallizePrice>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div className="flex flex-col gap-1  py-4 items-end">
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
                <div className="flex font-bold mt-2 text-lg justify-between w-60">
                    <p>To pay</p>
                    <p>
                        <CrystallizePrice currencyCode={contextState.currency.code}>{total}</CrystallizePrice>
                    </p>
                </div>
            </div>
        </>
    );
};
