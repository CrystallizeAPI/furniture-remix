import { useAppContext } from '~/ui/app-context/provider';
import logo from '~/assets/montonioLogo.svg';
import { useLocalCart } from '~/ui/hooks/useLocalCart';
import { useEffect, useState } from 'react';
import useLocalStorage from '@rehooks/local-storage';
import { Customer } from '@crystallize/js-api-client';
import { ServiceAPI } from '~/use-cases/service-api';

export const MontonioButton: React.FC<{ paying?: boolean; onClick: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    const { _t } = useAppContext();
    return (
        <button
            className="w-full h-[70px] text-white mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
            disabled={paying}
            onClick={onClick}
        >
            <img className="px-1 h-[25px]" src={`${logo}`} height="35" alt="Montonio" />
            <span className="text-textBlack">{paying ? _t('payment.processing') : ''}</span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const Montonio: React.FC = () => {
    const { cart, isEmpty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const { state } = useAppContext();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    if (isEmpty()) {
        return null;
    }

    return (
        <MontonioButton
            paying={paying}
            onClick={async () => {
                setPaying(true);
                try {
                    await ServiceAPI({ language: state.language, serviceApiUrl: state.serviceApiUrl }).placeCart(
                        cart,
                        customer,
                    );
                    const link = await ServiceAPI({
                        language: state.language,
                        serviceApiUrl: state.serviceApiUrl,
                    }).montonio.fetchPaymentLink(cart);
                    window.location.href = link.url;
                } catch (exception) {
                    console.log(exception);
                }
            }}
        />
    );
};
