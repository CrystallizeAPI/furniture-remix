import AdyenCheckout from '@adyen/adyen-web';
import { useEffect, useRef } from 'react';
import { useAppContext } from '../../app-context/provider';
import { useLocalCart } from '../../hooks/useLocalCart';
import { ServiceAPI } from '~/use-cases/service-api';
import useNavigate from '~/bridge/ui/useNavigate';
import { buildLanguageMarketAwareLink } from '../../../use-cases/LanguageAndMarket';
import useLocalStorage from '@rehooks/local-storage';
import { Customer } from '@crystallize/js-api-client';
import logo from '~/assets/adyenLogo.svg';

export const AdyenButton: React.FC<{
    paying?: boolean;
    onClick?: () => Promise<void> | void;
}> = ({ paying = false, onClick }) => {
    const { _t } = useAppContext();
    return (
        <button
            type={onClick ? 'button' : 'submit'}
            disabled={paying}
            onClick={onClick ? onClick : undefined}
            className="w-full text-white h-[70px] mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
        >
            <img className="h-[50px] px-1" src={`${logo}`} height="50" alt="Adyen" />
            <span id="button-text" className="text-textBlack">
                {paying ? _t('payment.processing') : ''}
            </span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const AdyenCheckoutForm: React.FC<{
    paying?: boolean;
    onClick?: () => Promise<void> | void;
}> = ({ paying = false, onClick }) => {
    const navigate = useNavigate();
    const paymentContainer = useRef(null);
    const { cart, isEmpty } = useLocalCart();
    const { state } = useAppContext();
    const variables = state.paymentImplementationVariables ? state.paymentImplementationVariables['adyen'] : {};
    if (!variables || !variables.CLIENT_KEY) {
        return null;
    }
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});

    const orderCartLink = buildLanguageMarketAwareLink(`/order/cart/${cart.cartId}`, state.language, state.market);

    const loadCheckoutForm = async (data: any) => {
        const configuration = {
            locale: state.language,
            environment: variables.ENVIRONMENT,
            clientKey: variables.CLIENT_KEY,
            analytics: {
                enabled: true,
            },
            session: {
                id: data.sessionId,
                sessionData: data.data.sessionData,
            },
            onPaymentCompleted: (result: any, component: any) => {
                navigate(orderCartLink, { replace: true });
            },
            onError: (error: any, component: any) => {
                console.error(error.name, error.message, error.stack, component);
            },
        };
        const checkout = await AdyenCheckout(configuration);
        if (paymentContainer.current) {
            checkout.update(configuration);
            checkout.create('dropin').mount(paymentContainer.current);
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
                const data = await ServiceAPI({
                    language: state.language,
                    serviceApiUrl: state.serviceApiUrl,
                }).adyen.initiatePayment(cart);
                await loadCheckoutForm(data);
            }
        })();
    }, [cart.items]);

    return (
        <div id="adyen-checkout__dropin adyen-checkout__dropin--ready">
            <div className="payment-container">
                <div ref={paymentContainer} className="payment"></div>
            </div>
        </div>
    );
};
