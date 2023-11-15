import React from 'react';
import { useAppContext } from '../../app-context/provider';
import logo from '~/assets/dinteroLogo.svg';
import { useLocalCart } from '../../hooks/useLocalCart';
import { ServiceAPI } from '../../../use-cases/service-api';
import { useEffect } from 'react';
import { SessionPaymentAuthorized, SessionPaymentOnHold } from '@dintero/checkout-web-sdk';
import useLocalStorage from '@rehooks/local-storage';
import { Customer } from '@crystallize/js-api-client';
import useNavigate from '~/bridge/ui/useNavigate';

export const DinteroButton: React.FC<{
    paying?: boolean;
    onClick: () => Promise<void> | void;
    children?: string;
}> = ({ paying = false, onClick, children }) => {
    const { _t } = useAppContext();
    const text = children ? children : '';
    return (
        <button
            className="w-full h-[70px] text-white mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
            disabled={paying}
            onClick={onClick}
        >
            <img className="px-1 h-[50px]" src={`${logo}`} height="50" alt="Dintero" />
            {paying ? (
                <span className="text-textBlack">{_t('payment.processing')}...</span>
            ) : (
                <span className="text-black">{`${text}`} ›</span>
            )}
        </button>
    );
};

export const Dintero: React.FC = () => {
    const { state, path } = useAppContext();
    const { cart, isEmpty, empty } = useLocalCart();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    const [formLoading, setFormLoading] = React.useState(true);
    let navigate = useNavigate();

    const variables = state.paymentImplementationVariables ? state.paymentImplementationVariables['dintero'] : {};
    if (!variables) {
        return null;
    }

    const triggerDintero = async () => {
        const data = await ServiceAPI({
            language: state.language,
            serviceApiUrl: state.serviceApiUrl,
        }).dintero.initiatePayment(cart);
        const container = document.getElementById('dintero-checkout-container') as HTMLDivElement | null;

        //only embed the iframe if it's not already there
        //sometimes the library is embedding the iframe multiple times
        if (typeof window !== 'undefined' && container && container.getElementsByTagName('iframe').length === 0) {
            const { embed } = await import('@dintero/checkout-web-sdk');

            await embed({
                container,
                popOut: true,
                sid: data.sessionId,
                onSession: (event) => {
                    if (event.type === 'SessionLoaded') {
                        setFormLoading(false);
                    }
                },
                onPaymentError: (error: any) => {
                    console.error(error.name, error.message, error.stack);
                },
                onPayment: async (event: SessionPaymentAuthorized | SessionPaymentOnHold, checkout) => {
                    const data = await ServiceAPI({
                        language: state.language,
                        serviceApiUrl: state.serviceApiUrl,
                    }).dintero.receivePayment(window.location.origin, event.transaction_id);
                    checkout.destroy();
                    if (data.id) {
                        empty();
                        navigate(path(`/order/cart/${cart.cartId}`), {
                            replace: true,
                        });
                    }
                },
            });
        }
    };

    useEffect(() => {
        (async () => {
            if (!isEmpty()) {
                try {
                    await ServiceAPI({
                        language: state.language,
                        serviceApiUrl: state.serviceApiUrl,
                    }).placeCart(cart, customer);
                } catch (exception) {
                    console.log(exception);
                }
                triggerDintero();
            }
        })();
    }, []);

    return (
        <div id="dintero-checkout-container">
            <div className="w-full text-center">
                <p className=" text-lg font-semibold">Checkout using Dintero</p>
            </div>
            {formLoading && (
                <div className="flex justify-center items-center h-96">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div>
            )}
        </div>
    );
};
