import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Customer } from '../../checkout-forms/address';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '~/core/app-context/provider';
import logo from '~/assets/pinkCLogo.svg';

export const CrystalCoinButton: React.FC<{ paying?: boolean; onClick: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    return (
        <button
            className="bg-[#000] text-[#fff] rounded-md px-8 py-4 flex flex-row items-center"
            disabled={paying}
            onClick={onClick}
        >
            <span>{paying ? 'Processing payment with...' : 'Pay with'}</span>
            <img className="w-[30px] h-[30px]" src={`${logo}`} width="25" height="25" alt="Crystal Coin" />
            <span>Crystal Coin</span>
        </button>
    );
};

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
        <CrystalCoinButton
            paying={paying}
            onClick={async () => {
                setPaying(true);
                await ServiceAPI(state.locale, state.serviceApiUrl).sendPaidOrderWithCrystalCoin(cart, customer);
                empty();
                navigate(`/order/cart/${cart.cartId}`, { replace: true });
            }}
        />
    );
};
