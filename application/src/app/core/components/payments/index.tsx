import { useAppContext } from '~/core/app-context/provider';
import { CrystalCard } from './crystal/card';
import { CrystalCoin } from './crystal/coin';
import { Stripe } from './stripe';

export const Payments: React.FC = () => {
    const { state } = useAppContext();
    const { config } = state;
    const paymentMethods = (config.configuration.CRYSTAL_PAYMENTS ?? '').split(',');
    const hasCoin = paymentMethods.includes('coin');
    const hasCard = paymentMethods.includes('card');
    return (
        <>
            <div className="payment-methods mt-5 w-full flex-row items-end justify-between">
                {hasCoin && (
                    <div className="payment-method mb-4">
                        <CrystalCoin />
                    </div>
                )}

                {hasCoin && (
                    <div className="payment-method mb-4">
                        <CrystalCard />
                    </div>
                )}
                {config.configuration.PUBLIC_KEY && (
                    <div className="payment-method mt-4" style={{ minHeight: 200 }}>
                        <Stripe />
                    </div>
                )}
            </div>
        </>
    );
};
