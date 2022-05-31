import { CrystalCoin } from './payments/crystalcoin';
import { Stripe } from './payments/stripe';

export const Payments: React.FC<{ isGuest: boolean }> = ({ isGuest }) => {
    return (
        <>
            <p>You can now proceed with the payment.</p>
            <div className="payment-methods mt-5 w-full flex-row items-end justify-between">
                <div className="payment-method mb-4">
                    <CrystalCoin isGuest={isGuest} />
                </div>
                <hr />
                {
                    <div className="payment-method mt-4" style={{ minHeight: 200 }}>
                        <Stripe />
                    </div>
                }
            </div>
        </>
    );
};
