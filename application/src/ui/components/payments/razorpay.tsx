import useLocalStorage from '@rehooks/local-storage';
import { useEffect } from 'react';
import { useAppContext } from '../../app-context/provider';
import { useLocalCart } from '../../hooks/useLocalCart';
import { ServiceAPI } from '~/use-cases/service-api';
import useNavigate from '~/bridge/ui/useNavigate';
import { Customer } from '~/use-cases/contracts/Customer';
import logo from '~/assets/razorpayLogo.svg';

export const RazorPayButton: React.FC<{ paying?: boolean; onClick?: () => Promise<void> | void }> = ({
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
            <img className="h-[40px]" src={`${logo}`} height="50" alt="Razorpay" />
            <span id="button-text" className="text-textBlack">
                {paying ? _t('payment.processing') : ''}
            </span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const RazorPay: React.FC = () => {
    const { state, path } = useAppContext();
    const { cart, isEmpty, empty } = useLocalCart();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    let navigate = useNavigate();

    const variables = state.paymentImplementationVariables ? state.paymentImplementationVariables['razorpay'] : {};
    if (!variables || !variables.RAZORPAY_ID) {
        return null;
    }

    const triggerRazorpay = async () => {
        const data = await ServiceAPI({
            language: state.language,
            serviceApiUrl: state.serviceApiUrl,
        }).razorpay.initiatePayment(cart);

        const { amount, id: order_id, currency } = data.data;

        const options = {
            key: variables.RAZORPAY_ID, // Enter the Key ID generated from the Dashboard
            amount: amount.toString(),
            currency: currency,
            name: 'FRNTR', // Enter the name of the company to be displayed
            description: '',
            image: { logo },
            order_id: order_id,
            handler: async function (response: any) {
                const data = {
                    orderCreationId: order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                    cartId: cart.cartId,
                };
                const result = await ServiceAPI({
                    language: state.language,
                    serviceApiUrl: state.serviceApiUrl,
                }).razorpay.receivePayment(window.location.origin, data);

                if (result.id) {
                    empty();
                    navigate(path(`/order/cart/${cart.cartId}`), { replace: true });
                }
            },
            prefill: {
                name: customer.firstname,
                email: customer.email,
            },
            theme: {
                color: '#61dafb',
            },
        };
        //@ts-ignore
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

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
                const razorpayJS = document.createElement('script');
                razorpayJS.src = 'https://checkout.razorpay.com/v1/checkout.js';
                document.head.appendChild(razorpayJS);
                triggerRazorpay();
            }
        })();
    }, [cart.items]);

    return <RazorPayButton />;
};
