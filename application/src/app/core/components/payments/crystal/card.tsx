import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useNavigate } from '@remix-run/react';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { Customer } from '../../checkout-forms/address';
import { ServiceAPI } from '~/use-cases/service-api';

export const CrystalCard: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    const navigate = useNavigate();
    if (isEmpty()) {
        return null;
    }

    return (
        <form
            onSubmit={async (event) => {
                setPaying(true);
                event.preventDefault();
                const cardInfo = new FormData(event.target as HTMLFormElement);
                await ServiceAPI.sendPaidOrderWithCrystalCard(cart, customer, Object.fromEntries(cardInfo.entries()));
                empty();
                navigate(`/order/cart/${cart.cartId}`, { replace: true });
            }}
        >
            <div className="grid grid-cols-3 gap-3">
                <label htmlFor="number" className="flex flex-col frntr-input">
                    <span>Card number*</span>
                    <input
                        type="text"
                        id="number"
                        placeholder="1234 1234 1234 1234"
                        name="number"
                        required
                        className="bg-grey"
                    />
                </label>
                <label htmlFor="expiration" className="flex flex-col frntr-input">
                    <span>Expiration</span>
                    <input
                        type="text"
                        id="expiration"
                        placeholder="MM / YY"
                        name="expiration"
                        required
                        className="bg-grey"
                    />
                </label>
                <label htmlFor="cvc" className="flex flex-col frntr-input">
                    <span>CVC*</span>
                    <input type="text" id="cvc" placeholder="CVC" name="cvc" required className="bg-grey" />
                </label>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
                <label htmlFor="country" className="flex flex-col frntr-input">
                    <span>Country*</span>
                    <input
                        type="text"
                        id="country"
                        placeholder="United States"
                        name="country"
                        required
                        className="bg-grey"
                    />
                </label>
                <label htmlFor="zip" className="flex flex-col frntr-input">
                    <span>Zipcode*</span>
                    <input type="text" id="zip" placeholder="94122" name="zip" required className="bg-grey" />
                </label>
            </div>
            <button className="bg-[#000] text-[#fff] rounded-md px-8 py-4 mt-5" type="submit" disabled={paying}>
                {paying ? 'Processing payment...' : 'Pay with Crystal Card'}
            </button>
        </form>
    );
};
