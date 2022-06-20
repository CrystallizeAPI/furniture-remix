import { useRemoteCart } from '~/core/hooks/useRemoteCart';
import { Image } from '@crystallize/reactjs-components/dist/image';
import displayPriceFor from '~/lib/pricing/pricing';
import { Price } from '~/lib/pricing/pricing-component';

export const CheckoutCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { cart, total } = remoteCart?.cart || { cart: null, total: null };
    if (loading) {
        return <p>Cart is loading...</p>;
    }
    return (
        <div className="lg:w-2/5 w-full">
            <h1 className="font-bold text-2xl mt-10 mb-5">Your cart</h1>
            {cart &&
                cart.items.map((item: any, index: number) => {
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
                                    <p className="text-md font-regular w-full">{item.product.name}</p>
                                    <p className="text-md font-semibold w-full">€{item.price.gross}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            {total && (
                <div className="flex flex-col gap-1  py-4 items-end">
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>Net</p>
                        <p>
                            <Price currencyCode="EUR">{total.net}</Price>
                        </p>
                    </div>
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>Tax amount</p>
                        <p>
                            <Price currencyCode="EUR">{total.taxAmount}</Price>
                        </p>
                    </div>
                    <div className="flex font-bold mt-2 text-lg justify-between w-60">
                        <p>To pay</p>
                        <p>
                            <Price currencyCode="EUR">{total.gross}</Price>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
