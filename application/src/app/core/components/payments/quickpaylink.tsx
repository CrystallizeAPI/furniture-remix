import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Customer } from '../checkout-forms/address';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '~/core/app-context/provider';
import logo from '~/assets/quickpayLogo.svg';

export const QuickPayLinkButton: React.FC<{ paying?: boolean; onClick: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    return (
        <button
            className="w-full h-[70px] text-white mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
            disabled={paying}
            onClick={onClick}
        >
            <img className="px-1 h-[35px]" src={`${logo}`} height="30" alt="Quickpay" />
            <span className="text-textBlack">{paying ? 'Processing payment' : ''}</span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const QuickPayLink: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const { state } = useAppContext();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    if (isEmpty()) {
        return null;
    }

    return (
        <QuickPayLinkButton
            paying={paying}
            onClick={async () => {
                setPaying(true);
                try {
                    await ServiceAPI(state.locale, state.serviceApiUrl).placeCart(cart, customer);
                    const link = await ServiceAPI(state.locale, state.serviceApiUrl).quickpay.fetchPaymentLink(cart);
                    window.location.href = link.url;
                } catch (exception) {
                    console.log(exception);
                }
            }}
        />
    );
};
