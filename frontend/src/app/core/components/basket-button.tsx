import { useRemoteCart } from '../hooks/useRemoteCart';
import BasketIcon from '~/assets/basketIcon.svg';
import { Link } from '@remix-run/react';
import { useLocalCart } from '../hooks/useLocalCart';

export const BasketButton = ({}) => {
    const { cart, isEmpty } = useLocalCart();
    let quantity = 0;
    if (!isEmpty()) {
        quantity = Object.keys(cart.items).reduce((acc: number, item: any) => acc + item.quantity, 0);
    }
    return (
        <div className="relative">
            <Link to="/cart">
                <img src={`${BasketIcon}`} />
            </Link>
            <div className="absolute -top-2 -right-2 rounded-full bg-textBlack w-4 h-4  text-[#fff] text-center text-[12px]">
                {quantity}
            </div>
        </div>
    );
};
