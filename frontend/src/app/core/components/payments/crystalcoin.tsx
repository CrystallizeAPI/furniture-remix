import { useLocalCart } from '~/core/hooks/useLocalCart';
import { sendAuthPaidOrder, sendGuestPaidOrder } from '~/core/UseCases';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { Guest } from '../checkout-forms/guest';

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
            className="bg-buttonBg2 px-4 py-2 mt-5"
            disabled={paying}
            onClick={async () => {
                setPaying(true);
                if (!isGuest) {
                    await sendAuthPaidOrder(cart);
                } else {
                    await sendGuestPaidOrder(cart, customer);
                }
                empty();
                navigate(`/order/cart/${cart.cartId}`, { replace: true });
            }}
        >
            Place with Crystal Coins
        </button>
    );
};
