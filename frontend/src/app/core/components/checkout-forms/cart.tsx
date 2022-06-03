import { useRemoteCart } from '~/core/hooks/useRemoteCart';
import { Image } from '@crystallize/reactjs-components/dist/image';

export const CheckoutCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { cart } = remoteCart || { cart: null, total: null };
    return (
        <div className="w-2/5">
            <h1 className="font-bold text-2xl mt-10 mb-5">Your cart</h1>
            {cart &&
                cart.cart.items.map((item: any, index: number) => (
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
                ))}
            {cart && (
                <div className="flex flex-col gap-1  py-4 items-end">
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>Net</p>
                        <p>€ {cart?.total.net}</p>
                    </div>
                    <div className="flex text-grey3 text-sm justify-between w-60">
                        <p>Tax amount</p>
                        <p>€ {cart?.total.taxAmount}</p>
                    </div>
                    <div className="flex font-bold mt-2 text-lg justify-between w-60">
                        <p>To pay</p>
                        <p>€ {cart?.total.gross}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
