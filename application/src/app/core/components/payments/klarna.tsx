import { Customer } from '../checkout-forms/address';
import useLocalStorage from '@rehooks/local-storage';
import { useNavigate } from '@remix-run/react';
import { useEffect, useState } from 'react';
import logo from '~/assets/klarnaLogo.svg';
import { useAppContext } from '~/core/app-context/provider';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { ServiceAPI } from '~/use-cases/service-api';

export const KlarnaButton: React.FC<{ paying?: boolean; onClick?: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    return (
        <button
            type={onClick ? 'button' : 'submit'}
            disabled={paying}
            onClick={onClick ? onClick : undefined}
            className="bg-[#000] text-[#fff] rounded-md px-8 py-4 flex flex-row items-center"
        >
            <span id="button-text">{paying ? 'Processing payment with...' : 'Pay with'}</span>
            <img className="h-[30px] px-3" src={`${logo}`} height="30" alt="Klarna" />
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
    const { state } = useAppContext();
    const { cart, isEmpty, empty } = useLocalCart();
    const navigate = useNavigate();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    if (isEmpty()) {
        return null;
    }
    const [methodsChoices, setMethodsChoices] = useState<KlarnaMethod[]>([]);
    const [method, setMethod] = useState<KlarnaMethod | undefined>(undefined);

    useEffect(() => {
        (async () => {
            if (!isEmpty()) {
                const data = await ServiceAPI(state.locale, state.serviceApiUrl).klarna.initiatePayment(cart);
                const methods = data.payment_method_categories;
                //@ts-ignore
                window.Klarna.Payments.init({
                    client_token: data.client_token,
                });
                if (methods.length === 1) {
                    setMethod(methods[0]);
                } else {
                    setMethodsChoices(methods);
                }
            }
        })();
    }, [cart.items]);

    useEffect(() => {
        if (!method) {
            return;
        }
        (async () => {
            //@ts-ignore
            window.Klarna.Payments.load(
                {
                    container: '#klarna-payments-container',
                    payment_method_category: method.identifier,
                },
                async () => {
                    await ServiceAPI(state.locale, state.serviceApiUrl).placeCart(cart, customer);
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
                                navigate(`/order/cart/${cart.cartId}`, { replace: true });
                            }
                        },
                    );
                },
            );
        })();
    }, [method]);

    return (
        <>
            <div id="klarna-payments-container" />
            {methodsChoices.length > 0 && !method && (
                <>
                    <p>Klarna Payment Methods: </p>
                    <div className="flex flex-row flex-wrap">
                        {methodsChoices.map((method) => (
                            <div key={method.identifier} className="w-1/2">
                                <button
                                    onClick={() => setMethod(method)}
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
