import { CrystalCoin } from './payments/crystalcoin';
import { Stripe } from './payments/stripe';

export const Payments: React.FC<{ isGuest: boolean }> = ({ isGuest }) => {
    return (
        <>
            <p>You can now proceed with the payment.</p>
            <div className="payment-methods mt-5 w-full flex items-end justify-between">
                <button className="bg-grey px-4 py-2">Back</button>
                <div className="payment-method">
                    <CrystalCoin isGuest={isGuest} />
                </div>
                {/* <div className="payment-method" style={{ minHeight: 200 }}>
                    <Stripe />
                </div> */}
            </div>
        </>
    );
};
