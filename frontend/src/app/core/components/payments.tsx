import { useAuth } from "../hooks/useAuth";
import { CrystalCoin } from "./payments/crystalcoin";
import { Stripe } from "./payments/stripe";

export const Payments: React.FC = () => {
    const { userInfos } = useAuth();
    return <>
        <p>Hello {userInfos.firstname} {userInfos.lastname},</p>
        <div className='payment-methods'>
            <div className='payment-method'>
                <CrystalCoin />
            </div>
            <div className='payment-method' style={{ minHeight: 200 }}>
                <Stripe />
            </div>
        </div>
    </>;
}



