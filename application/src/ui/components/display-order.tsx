import { useAppContext } from '../app-context/provider';
import { Price } from '../lib/pricing/pricing-component';

export const OrderDisplay: React.FC<{ order: any }> = ({ order }) => {
    const { state: contextState, _t } = useAppContext();
    return (
        <div className="w-3/4 mx-auto">
            <div className="mt-10">
                <h1 className="font-bold text-3xl">{_t('order.confirmation')}</h1>
                <p className="mt-4">{_t('order.recievedMessage')}</p>
                <p>
                    {_t('order.orderId')}: #{order.id}.
                </p>
                <div className="mt-2">
                    {order.cart.map((item: any, index: number) => {
                        return (
                            <div key={index} className="bg-grey2 px-3 py-2 mb-2 gap-2 flex items-center">
                                <div className="img-container overflow-hidden rounded-md img-contain w-[50px] h-[70px]">
                                    <img src={item.imageUrl} />
                                </div>
                                <div className="flex w-full justify-between">
                                    <div>
                                        <p className="font-semibold">
                                            {item.name} x {item.quantity}
                                        </p>
                                    </div>
                                    <p>
                                        <Price currencyCode={contextState.currency.code}>{item.price.gross}</Price>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex flex-col gap-4 border-t-2 border-grey4 py-4 items-end px-4 mt-5">
                        <div className="flex text-grey3 justify-between w-60">
                            <p>Net</p>
                            <p>
                                <Price currencyCode={contextState.currency.code}>{order.total.net}</Price>
                            </p>
                        </div>
                        <div className="flex text-grey3 justify-between w-60">
                            <p>{_t('cart.taxAmount')}</p>
                            <p>
                                <Price currencyCode={contextState.currency.code}>
                                    {order.total.gross - order.total.net}
                                </Price>
                            </p>
                        </div>
                        <div className="flex font-bold text-xl justify-between w-60">
                            <p>Paid</p>
                            <p>
                                <Price currencyCode={contextState.currency.code}>{order.total.gross}</Price>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
