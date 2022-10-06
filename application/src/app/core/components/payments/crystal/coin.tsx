import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Customer } from '../../checkout-forms/address';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '~/core/app-context/provider';

export const CrystalCoin: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const { state } = useAppContext();
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
                await ServiceAPI(state.locale, state.serviceApiUrl).sendPaidOrderWithCrystalCoin(cart, customer);
                empty();
                navigate(`/order/cart/${cart.cartId}`, { replace: true });
            }}
        >
            {paying ? 'Processing payment...' : 'Pay with Crystal Coin'}
        </button>
    );
};
