import useLocalStorage from '@rehooks/local-storage';
import { useEffect, useState } from 'react';
import logo from '~/assets/klarnaLogo.svg';
import { useAppContext } from '../../app-context/provider';
import { useLocalCart } from '../../hooks/useLocalCart';
import { ServiceAPI } from '~/use-cases/service-api';
import useNavigate from '~/bridge/ui/useNavigate';
import { Customer } from '~/use-cases/contracts/Customer';

export const KlarnaButton: React.FC<{ paying?: boolean; onClick?: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    const { _t } = useAppContext();
    return (
        <button
            type={onClick ? 'button' : 'submit'}
            disabled={paying}
            onClick={onClick ? onClick : undefined}
            className="w-full text-white h-[70px] mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
        >
            <img className="h-[50px] px-1" src={`${logo}`} height="50" alt="Klarna" />
            <span id="button-text" className="text-textBlack">
                {paying ? _t('payment.processing') : ''}
            </span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

type KlarnaMethod = {
    asset_urls: {
        standard: string;
    };
    identifier: string;
    name: string;
};

export const Klarna: React.FC = () => {
    const { state, path } = useAppContext();
    const { cart, isEmpty, empty } = useLocalCart();
    const navigate = useNavigate();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    if (isEmpty()) {
        return null;
    }
    const [methodsChoices, setMethodsChoices] = useState<KlarnaMethod[]>([]);

    const triggerKlarna = async (method: KlarnaMethod) => {
        //@ts-ignore
        window.Klarna.Payments.load(
            {
                container: '#klarna-payments-container',
                payment_method_category: method.identifier,
            },
            async () => {
                await ServiceAPI({ language: state.language, serviceApiUrl: state.serviceApiUrl }).placeCart(
                    cart,
                    customer,
                );
                //@ts-ignore
                window.Klarna.Payments.authorize(
                    {
                        payment_method_category: method.identifier,
                    },
                    {},
                    function (res: any) {
                        const approved = res.approved;
                        if (approved) {
                            empty();
                            navigate(path(`/order/cart/${cart.cartId}`), { replace: true });
                        }
                    },
                );
            },
        );
    };

    useEffect(() => {
        (async () => {
            if (!isEmpty()) {
                const klarnaJS = document.createElement('script');
                klarnaJS.src = 'https://x.klarnacdn.net/kp/lib/v1/api.js';
                klarnaJS.onload = async () => {
                    const api = ServiceAPI({
                        language: state.language,
                        serviceApiUrl: state.serviceApiUrl,
                    });
                    const data = await api.klarna.initiatePayment(cart);
                    const methods = data.payment_method_categories;
                    //@ts-ignore
                    window.Klarna.Payments.init({
                        client_token: data.client_token,
                    });
                    if (methods.length === 1) {
                        triggerKlarna(methods[0]);
                    } else {
                        setMethodsChoices(methods);
                    }
                };
                document.head.appendChild(klarnaJS);
            }
        })();
    }, [cart.items]);

    return (
        <>
            <div id="klarna-payments-container" />
            {methodsChoices.length > 0 && (
                <>
                    <p>Klarna Payment Methods: </p>
                    <div className="flex flex-row flex-wrap">
                        {methodsChoices.map((method) => (
                            <div key={method.identifier} className="w-1/2">
                                <button
                                    onClick={() => triggerKlarna(method)}
                                    className="bg-[#000] text-[#fff] rounded-md px-8 py-4 flex flex-row items-center"
                                >
                                    <img
                                        className="h-[30px] px-3"
                                        src={method.asset_urls.standard}
                                        height="30"
                                        alt={`Klarna - ${method.name}`}
                                    />{' '}
                                    {method.name}
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );
};
