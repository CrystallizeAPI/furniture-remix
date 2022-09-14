import { CrystalCoin } from './payments/crystalcoin';
import { Stripe } from './payments/stripe';

export const Payments: React.FC = () => {
    return (
        <>
            <div className="payment-methods mt-5 w-full flex-row items-end justify-between">
                <div className="payment-method mb-4">
                    <CrystalCoin />
                </div>
                <hr />
                {window.ENV.STRIPE_PUBLIC_KEY && (
                    <div className="payment-method mt-4" style={{ minHeight: 200 }}>
                        <Stripe />
                    </div>
                )}
            </div>
        </>
    );
};
