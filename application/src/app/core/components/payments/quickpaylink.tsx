import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Customer } from '../checkout-forms/address';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '~/core/app-context/provider';
import logo from '~/assets/quickpayLogo.svg';

export const QuickPayLink: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const { state } = useAppContext();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    if (isEmpty()) {
        return null;
    }

    return (
        <button
            className="bg-[#000] text-[#fff] rounded-md px-8 py-4 flex flex-row items-center"
            disabled={paying}
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
        >
            <span>{paying ? 'Processing payment with...' : 'Pay with'}</span>
            <img className="px-1 h-[30px]" src={`${logo}`} height="30" alt="Quickpay" />
        </button>
    );
};
