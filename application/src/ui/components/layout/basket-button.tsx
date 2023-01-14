import BasketIcon from '~/assets/basketIcon.svg';
import { useLocalCart } from '../../hooks/useLocalCart';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useAppContext } from '../../app-context/provider';
import Link from '~/bridge/ui/Link';

export const BasketButton = ({}) => {
    const { cart, isEmpty } = useLocalCart();
    const { path } = useAppContext();
    let quantity = 0;
    if (!isEmpty()) {
        quantity = Object.keys(cart.items).reduce((acc: number, key: string) => acc + cart.items[key].quantity, 0);
    }
    return (
        <Link to={path('/cart')} className="p-2 rounded-md hover:bg-[#efefef] relative">
            <img className="w-[30px] h-[30px]" src={`${BasketIcon}`} width="25" height="25" alt="Basket icon" />
            <ClientOnly>
                <div className="absolute -top-2 -right-2 flex text-center items-center border-[4px] border-[#fff] justify-center rounded-sm bg-[#efefef] w-[24px] h-[24px]   text-600 text-[10px]">
                    {quantity}
                </div>
            </ClientOnly>
        </Link>
    );
};
