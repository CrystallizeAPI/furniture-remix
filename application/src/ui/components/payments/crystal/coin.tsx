import { useLocalCart } from '../../../hooks/useLocalCart';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '../../../app-context/provider';
import logo from '~/assets/crystalcoin-logo.svg';
import useNavigate from '~/bridge/ui/useNavigate';
import { Customer } from '~/use-cases/contracts/Customer';

export const CrystalCoinButton: React.FC<{ paying?: boolean; onClick: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    const { _t } = useAppContext();
    return (
        <button
            data-testid="crystal-coin-payment-button"
            className="crystal-coin w-full text-white h-[70px] mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
            disabled={paying}
            onClick={onClick}
        >
            <img className="h-[35px]" src={`${logo}`} height="35" alt="Crystal Coin" />
            <span className="text-textBlack">{paying ? _t('payment.processing') : ''}</span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const CrystalCoin: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const { state, path } = useAppContext();
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
                await ServiceAPI({
                    language: state.language,
                    serviceApiUrl: state.serviceApiUrl,
                }).sendPaidOrderWithCrystalCoin(cart, customer);
                empty();
                navigate(path(`/order/cart/${cart.cartId}`), { replace: true });
            }}
        />
    );
};
