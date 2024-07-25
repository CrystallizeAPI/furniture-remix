import { useRemoteCart } from '../../hooks/useRemoteCart';
import { Image } from '@crystallize/reactjs-components';
import { useAppContext } from '../../app-context/provider';
import { Price } from '../../lib/pricing/pricing-component';
import { CartItemPrice, CartItemPriceSkeleton } from '../price';
import { useLocalCart } from '../../hooks/useLocalCart';
import { Price as CrystallizePrice } from '../../lib/pricing/pricing-component';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { Voucher } from '~/use-cases/contracts/Voucher';

export const CheckoutCart: React.FC = () => {
    const { remoteCart } = useRemoteCart();
    const { items, total } = remoteCart || { cart: null, total: null };

    const { state: contextState, _t } = useAppContext();
    //const voucher = remoteCart?.extra?.voucher as Voucher | undefined;
    return (
        <div className="lg:w-2/5 w-full py-2">
            <h1 className="font-bold text-2xl mt-10 mb-5">{_t('cart.yourCart')}</h1>
            {!items && <OptimisticHydratedCart />}
            {items &&
                items.map((item: any, index: number) => {
                    return (
                        <div
                            key={index}
                            className="mt-2 min-h-[150px] rounded-md flex justify-between bg-grey2 p-2 items-center"
                        >
                            <div className="flex cart-item gap-3">
                                <div className="img-container img-contain w-[60px] h-[60px]">
                                    <Image
                                        {...item?.images?.[0]}
                                        sizes="100px"
                                        fallbackAlt={item.variant.name}
                                        width={60}
                                        height={60}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-md font-regular w-full">
                                        {item.variant.name} x {item.quantity}
                                    </p>
                                    <CartItemPrice
                                        discount={item.price?.discounts}
                                        variantPrice={item.variant?.price?.gross}
                                        total={item.price?.gross}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            {total && (
                <div className="flex flex-col gap-1  py-4 items-end">
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>{_t('cart.discount')}</p>
                        <p>
                            <Price currencyCode={contextState.currency.code}>
                                {total.discounts.reduce((memo: number, discount: any) => {
                                    return memo + discount?.amount || 0;
                                }, 0)}
                            </Price>
                        </p>
                    </div>
                    {/* {voucher && voucher.code !== "" && (
						<div className="flex text-grey3 text-sm justify-between w-60">
							<p>{_t("cart.voucherCode")}</p>
							<span>{voucher.code}</span>
						</div>
					)} */}
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>{_t('cart.taxAmount')}</p>
                        <p>
                            <Price currencyCode={contextState.currency.code}>{total.taxAmount}</Price>
                        </p>
                    </div>
                    <div className="flex font-bold mt-2 text-lg justify-between w-60">
                        <p>{_t('cart.toPay')}</p>
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
    const { state: contextState, _t } = useAppContext();
    let total = 0;
    return (
        <ClientOnly>
            <>
                {Object.keys(cart.items).map((sku: string, index: number) => {
                    const item = cart.items[sku as keyof typeof cart];
                    total += item.quantity * item.price;
                    return (
                        <div
                            key={index}
                            className="mt-2 min-h-[150px] rounded-md flex justify-between bg-grey2 p-2 items-center"
                        >
                            <div className="flex cart-item gap-3">
                                <div className="img-container img-contain w-[60px] h-[60px]">
                                    <Image src={item.image} alt={item.name} width={60} height={60} />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-md font-regular w-full">
                                        {item.name} x {item.quantity}
                                    </p>
                                    <CartItemPriceSkeleton price={item.price} quantity={item.quantity} />
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div className="flex flex-col gap-1  py-4 items-end">
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>{_t('cart.discount')}</p>
                        <div className="animate-pulse bg-[#efefef]  h-4 w-20 rounded-md" />
                    </div>
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>{_t('cart.taxAmount')}</p>
                        <div className="animate-pulse bg-[#efefef]  h-4 w-20 rounded-md" />
                    </div>
                    <div className="flex font-bold mt-2 text-lg justify-between w-60">
                        <p>{_t('cart.toPay')}</p>
                        <p>
                            <CrystallizePrice currencyCode={contextState.currency.code}>{total}</CrystallizePrice>
                        </p>
                    </div>
                </div>
            </>
        </ClientOnly>
    );
};
