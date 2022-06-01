import { useRemoteCart } from '~/core/hooks/useRemoteCart';
import { Image } from '@crystallize/reactjs-components/dist/image';

export const CheckoutCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart();
    const { cart } = remoteCart || { cart: null, total: null };
    return (
        <div className="w-2/5">
            <h1 className="font-bold text-2xl mt-10 mb-5">Cart</h1>
            {cart &&
                cart.cart.items.map((item: any, index: number) => (
                    <div key={index} className="mt-2 rounded-md flex justify-between bg-grey2 p-5 items-center">
                        <div className="flex cart-item gap-3 items-center">
                            <Image {...item?.variant.images?.[0]} sizes="100px" />
                            <div className="flex flex-col">
                                <p className="text-lg font-regular w-full">{item.product.name}</p>
                                <p className="text-lg font-semibold w-full">€{item.price.gross}</p>
                            </div>
                        </div>
                    </div>
                ))}
            {cart && (
                <div className="flex flex-col gap-4 border-b-2 border-grey4 py-4 items-end">
                    <div className="flex text-grey3 justify-between w-60">
                        <p>Net</p>
                        <p>€ {cart.total.net}</p>
                    </div>
                    <div className="flex text-grey3 justify-between w-60">
                        <p>Tax amount</p>
                        <p>€ {cart.total.taxAmount}</p>
                    </div>
                    <div className="flex font-bold text-lg justify-between w-60">
                        <p>To pay</p>
                        <p>€ {cart.total.gross}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
