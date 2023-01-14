import { useLocalCart } from '../../../hooks/useLocalCart';
import { useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '../../../app-context/provider';
import logo from '~/assets/crystalcard-logo.svg';
import useNavigate from '~/bridge/ui/useNavigate';
import { Customer } from '~/use-cases/contracts/Customer';

export const CrystalCardButton: React.FC<{ paying?: boolean; onClick?: () => Promise<void> | void }> = ({
    paying = false,
    onClick,
}) => {
    const { _t } = useAppContext();
    return (
        <button
            className="w-full h-[70px] text-white mt-2 rounded-md px-8 bg-grey flex flex-row justify-between items-center border border-transparent hover:border-black"
            type={onClick ? 'button' : 'submit'}
            disabled={paying}
            onClick={onClick ? onClick : undefined}
        >
            <img className=" h-[35px]" src={`${logo}`} height="35" alt="Crystal Card" />
            <span className="text-textBlack">{paying ? _t('payment.processing') : ''}</span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const CrystalCard: React.FC = () => {
    const { cart, isEmpty, empty } = useLocalCart();
    const { state, path, _t } = useAppContext();
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
                await ServiceAPI({
                    language: state.language,
                    serviceApiUrl: state.serviceApiUrl,
                }).sendPaidOrderWithCrystalCard(cart, customer, Object.fromEntries(cardInfo.entries()));
                empty();
                navigate(path(`/order/cart/${cart.cartId}`), { replace: true });
            }}
        >
            <div className="grid grid-cols-3 gap-3">
                <label htmlFor="number" className="flex flex-col frntr-input">
                    <span>{_t('payment.cardNumber')}*</span>
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
                    <span>{_t('payment.expiration')}</span>
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
                    <span>{_t('payment.country')}*</span>
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
                    <span>{_t('payment.zipCode')}*</span>
                    <input type="text" id="zip" placeholder="94122" name="zip" required className="bg-grey" />
                </label>
            </div>
            <br />
            <CrystalCardButton paying={paying} />
        </form>
    );
};
