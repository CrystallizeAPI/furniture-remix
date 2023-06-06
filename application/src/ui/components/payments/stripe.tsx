'use client';

import useLocalStorage from '@rehooks/local-storage';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useAppContext } from '../../app-context/provider';
import { useLocalCart } from '../../hooks/useLocalCart';
import { ServiceAPI } from '~/use-cases/service-api';
import logo from '~/assets/stripeLogo.svg';
import useNavigate from '~/bridge/ui/useNavigate';
import { Customer } from '~/use-cases/contracts/Customer';

export const StripeButton: React.FC<{ paying?: boolean; onClick?: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    const { _t } = useAppContext();
    return (
        <button
            type={onClick ? 'button' : 'submit'}
            disabled={paying}
            onClick={onClick ? onClick : undefined}
            className="w-full text-white mt-2 h-[70px] rounded-md px-8 bg-grey flex flex-row justify-between items-center border border-transparent hover:border-black"
        >
            <img className="h-[50px]" src={`${logo}`} height="50" alt="Stripe" />
            <span id="button-text" className="text-textBlack">
                {paying ? _t('payment.processing') : ''}
            </span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const Stripe: React.FC = () => {
    const { state } = useAppContext();
    const [clientSecret, setClientSecret] = useState<string>('');
    const { cart, isEmpty } = useLocalCart();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});

    const variables = state.paymentImplementationVariables ? state.paymentImplementationVariables['stripe'] : {};
    if (!variables || !variables.PUBLIC_KEY) {
        return null;
    }
    const stripePromise = loadStripe(variables.PUBLIC_KEY);

    useEffect(() => {
        (async () => {
            if (!isEmpty()) {
                // before anything else we place the cart
                try {
                    await ServiceAPI({ language: state.language, serviceApiUrl: state.serviceApiUrl }).placeCart(
                        cart,
                        customer,
                    );
                } catch (exception) {
                    console.log(exception);
                }

                const data = await ServiceAPI({
                    language: state.language,
                    serviceApiUrl: state.serviceApiUrl,
                }).stripe.fetchPaymentIntent(cart);
                setClientSecret(data.key);
            }
        })();
    }, [cart.items]);

    if (!clientSecret) {
        return null;
    }
    return (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
            <StripCheckoutForm />
        </Elements>
    );
};

const StripCheckoutForm: React.FC = () => {
    const { cart, empty } = useLocalCart();
    const { path } = useAppContext();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [state, setState] = useState<{
        error: string | null;
        succeeded: boolean;
        processing: boolean;
    }>({ succeeded: false, error: null, processing: false });

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setState({
            ...state,
            processing: true,
        });

        const payload = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://' + window.location.host + '/order/cart/' + cart.cartId,
            },
            redirect: 'if_required',
        });

        if (payload.error) {
            setState({
                ...state,
                error: `Payment failed ${payload.error.message}`,
                processing: false,
            });
        } else {
            setState({
                ...state,
                error: null,
                processing: false,
                succeeded: true,
            });
            empty();
            navigate(path(`/order/cart/${cart.cartId}`), { replace: true });
        }
    };

    return (
        <form id="stripe-payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <br />
            <StripeButton paying={state.processing || !stripe || !elements} />
        </form>
    );
};
