

import { useNavigate } from '@remix-run/react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { fetchPaymentIntent, placeCart } from '~/core/UseCases';

//@ts-ignore
const stripePromise = loadStripe(typeof window !== 'undefined' ? window.ENV.STRIPE_PUBLIC_KEY : (typeof process !== 'undefined' ? process.env.STRIPE_PUBLIC_KEY : window.ENV.STRIPE_PUBLIC_KEY));

export const Stripe: React.FC = () => {
    const [clientSecret, setClientSecret] = useState<string>('');
    const { cart, isEmpty } = useLocalCart();

    useEffect(() => {
        (async () => {
            if (!isEmpty()) {
                const data = await fetchPaymentIntent(cart);
                setClientSecret(data.key);
            }
        })();

    }, [cart.items]);

    if (!clientSecret) {
        return null;
    }
    return <Elements options={{ clientSecret }} stripe={stripePromise}>
        <StripCheckoutForm clientSecret={clientSecret} />
    </Elements>;
}

const StripCheckoutForm: React.FC<{ clientSecret: string }> = ({ clientSecret }) => {
    const { cart, empty } = useLocalCart();
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
            processing: true
        });

        // before anything else we place the cart
        try {
            await placeCart(cart);
        } catch (exception) {
            console.log(exception);
        };

        const payload = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: 'https://' + location.host + '/order/cart/' + cart.cartId,
            },
            redirect: "if_required"
        });

        if (payload.error) {
            setState({
                ...state,
                error: `Payment failed ${payload.error.message}`,
                processing: false
            });
        } else {
            setState({
                ...state,
                error: null,
                processing: false,
                succeeded: true
            });
            empty();
            navigate(`/order/cart/${cart.cartId}`, { replace: true });
        }
    };

    return <form id="stripe-payment-form" onSubmit={handleSubmit}>
        <PaymentElement id="payment-element" />
        <button disabled={state.processing || !stripe || !elements} id="submit">
            <span id="button-text">
                {state.processing ? <div className="spinner" id="spinner"></div> : "Place with Stripe"}
            </span>
        </button>
    </form>
}
