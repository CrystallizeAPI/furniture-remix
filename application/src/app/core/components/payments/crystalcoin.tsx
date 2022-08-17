import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Customer } from '../checkout-forms/address';
import { ServiceAPI } from '~/use-cases/service-api';

export const CrystalCoin: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    const navigate = useNavigate();
    if (isEmpty()) {
        return null;
    }

    return (
        <button
            className="bg-[#000] text-[#fff] rounded-md px-8 py-4 mt-5"
            disabled={paying}
            onClick={async () => {
                setPaying(true);
                await ServiceAPI.sendPaidOrder(cart, customer);
                empty();
                navigate(`/order/cart/${cart.cartId}`, { replace: true });
            }}
        >
            Pay with Crystal Coins
        </button>
    );
};
