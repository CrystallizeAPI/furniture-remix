import { useRemoteCart } from '../hooks/useRemoteCart';
import BasketIcon from '~/assets/basketIcon.svg';
import { Link } from '@remix-run/react';

export const BasketButton = ({}) => {
    const { remoteCart, loading } = useRemoteCart();
    let quantity = 0;
    if (remoteCart) {
        quantity = remoteCart?.cart?.cart?.items.reduce((acc: any, item: any) => acc + item.quantity, 0);
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
