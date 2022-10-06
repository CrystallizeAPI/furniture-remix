import { useAppContext } from '~/core/app-context/provider';
import { CrystalCard } from './crystal/card';
import { CrystalCoin } from './crystal/coin';
import { Stripe } from './stripe';

export const Payments: React.FC = () => {
    const { state } = useAppContext();
    const paymentMethods = state.crystalPayments;
    const hasCoin = state.paymentImplementations.includes('crystal') && paymentMethods.includes('coin');
    const hasCard = state.paymentImplementations.includes('crystal') && paymentMethods.includes('card');
    return (
        <>
            <div className="payment-methods mt-5 w-full flex-row items-end justify-between">
                {hasCoin && (
                    <div className="payment-method mb-4">
                        <CrystalCoin />
                    </div>
                )}

                {hasCard && (
                    <div className="payment-method mb-4">
                        <CrystalCard />
                    </div>
                )}
                {state.paymentImplementations.includes('stripe') && (
                    <div className="payment-method mt-4" style={{ minHeight: 200 }}>
                        <Stripe />
                    </div>
                )}
            </div>
        </>
    );
};
