import { useAuth } from '../hooks/useAuth';
import { CrystalCoin } from './payments/crystalcoin';
import { Stripe } from './payments/stripe';

export const Payments: React.FC = () => {
    const { userInfos } = useAuth();
    return (
        <>
            <h1 className="font-bold text-xl mt-5">Success!</h1>
            <p>Logged in successfully. You can now proceed with the payment.</p>
            <div className="payment-methods mt-5 w-full flex items-end justify-between">
                <button className="bg-grey px-4 py-2">Back</button>
                <div className="payment-method">
                    <CrystalCoin />
                </div>
                {/* <div className="payment-method" style={{ minHeight: 200 }}>
                    <Stripe />
                </div> */}
            </div>
        </>
    );
};
