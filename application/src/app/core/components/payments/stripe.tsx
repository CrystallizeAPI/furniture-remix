import useLocalStorage from '@rehooks/local-storage';
import { useNavigate } from '@remix-run/react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { ServiceAPI } from '~/core/use-cases/service-api';
import { Guest } from '../checkout-forms/guest';

const appearance = {
    theme: 'none',
    labels: 'floating',
    variables: {
        fontFamily: 'ui-sans-serif, sans-serif',
        fontLineHeight: '1.5',
        fontSizeBase: '14px',
        fontWeightNormal: '600',
        borderRadius: '10px',
        colorBackground: '#f9f9f9',
        colorPrimaryText: '#000',
        spacingUnit: '6px',
    },
    rules: {
        '.Tab': {
            border: '1px solid #E0E6EB',
            boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02)',
        },

        '.Tab:hover': {
            color: 'var(--colorText)',
        },
        '.Label': {
            backgroundColor: 'red',
        },
        '.Tab--selected': {
            borderColor: '#E0E6EB',
            boxShadow:
                '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 3px 6px rgba(18, 42, 66, 0.02), 0 0 0 2px var(--colorPrimary)',
        },

        '.Input--invalid': {
            boxShadow: '0 1px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 2px var(--colorDanger)',
        },
    },
};

export const Stripe: React.FC<{ isGuest: boolean }> = ({ isGuest = false }) => {
    const stripePromise = loadStripe(window.ENV.STRIPE_PUBLIC_KEY);
    const [clientSecret, setClientSecret] = useState<string>('');
    const { cart, isEmpty } = useLocalCart();
    useEffect(() => {
        (async () => {
            if (!isEmpty()) {
                const data = await ServiceAPI.fetchPaymentIntent(cart);
                setClientSecret(data.key);
            }
        })();
    }, [cart.items]);

    if (!clientSecret) {
        return null;
    }
    return (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
            <StripCheckoutForm isGuest={isGuest} />
        </Elements>
    );
};

const StripCheckoutForm: React.FC<{ isGuest: boolean }> = ({ isGuest = false }) => {
    const { cart, empty } = useLocalCart();
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [state, setState] = useState<{
        error: string | null;
        succeeded: boolean;
        processing: boolean;
    }>({ succeeded: false, error: null, processing: false });
    const [customer] = useLocalStorage<Partial<Guest>>('customer', {});

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!stripe || !elements) {
            return;
        }
        setState({
            ...state,
            processing: true,
        });

        // before anything else we place the cart
        try {
            if (!isGuest) {
                await ServiceAPI.placeCart(cart);
            } else {
                await ServiceAPI.placeCart(cart, customer);
            }
        } catch (exception) {
            console.log(exception);
        }

        const payload = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://' + location.host + '/order/cart/' + cart.cartId,
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
            navigate(`/order/cart/${cart.cartId}`, { replace: true });
        }
    };

    return (
        <form id="stripe-payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button
                disabled={state.processing || !stripe || !elements}
                id="submit"
                className="bg-[#000] text-[#fff] rounded-md px-8 py-4 mt-5"
            >
                <span id="button-text">
                    {state.processing ? <div className="spinner" id="spinner"></div> : 'Pay with Stripe'}
                </span>
            </button>
        </form>
    );
};
