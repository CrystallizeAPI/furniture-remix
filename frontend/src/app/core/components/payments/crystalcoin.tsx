import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Guest } from '../checkout-forms/guest';
import { ServiceAPI } from '~/core/use-cases/service-api';

export const CrystalCoin: React.FC<{ isGuest: boolean }> = ({ isGuest = false }) => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const [customer] = useLocalStorage<Partial<Guest>>('customer', {});
    const navigate = useNavigate();
    if (isEmpty()) {
        return null;
    }

    return (
        <button
            className="text-[#000] font-medium rounded-md px-2 py-2 mt-2"
            disabled={paying}
            onClick={async () => {
                setPaying(true);
                if (!isGuest) {
                    await ServiceAPI.sendAuthPaidOrder(cart);
                } else {
                    await ServiceAPI.sendGuestPaidOrder(cart, customer);
                }
                empty();
                navigate(`/order/cart/${cart.cartId}`, { replace: true });
            }}
        >
            Pay with Crystal Coins
        </button>
    );
};
