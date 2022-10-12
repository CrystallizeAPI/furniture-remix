import { useAppContext } from '~/core/app-context/provider';
import { CrystalCard } from './crystal/card';
import { CrystalCoin } from './crystal/coin';
import { QuickPayLink } from './quickpaylink';
import { Stripe } from './stripe';

export const Payments: React.FC = () => {
    const { state } = useAppContext();
    const paymentMethods = state.crystalPayments;
    const hasCoin = state.paymentImplementations.includes('crystal') && paymentMethods.includes('coin');
    const hasCard = state.paymentImplementations.includes('crystal') && paymentMethods.includes('card');
    return (
        <>
            <hr className="m-10" />
            <p>We are showcasing different payment integrations:</p>
            <div className="payment-methods mt-5 w-full flex-row items-end justify-between">
                {hasCoin && (
                    <div className="payment-method mb-4 bg-grey rounded p-6">
                        <CrystalCoin />
                    </div>
                )}
                {hasCard && (
                    <div className="payment-method mb-4 bg-grey rounded p-6 ">
                        <CrystalCard />
                    </div>
                )}
                {state.paymentImplementations.includes('quickpay') && (
                    <div className="payment-method mb-4 bg-grey rounded p-6">
                        <QuickPayLink />
                    </div>
                )}
                {state.paymentImplementations.includes('stripe') && (
                    <div className="payment-method mb-4 bg-grey rounded p-6" style={{ minHeight: 200 }}>
                        <Stripe />
                    </div>
                )}
            </div>
        </>
    );
};
