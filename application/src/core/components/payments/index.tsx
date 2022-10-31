import { useState } from 'react';
import { useAppContext } from '~/core/app-context/provider';
import { CrystalCard, CrystalCardButton } from './crystal/card';
import { CrystalCoin, CrystalCoinButton } from './crystal/coin';
import { Klarna, KlarnaButton } from './klarna';
import { QuickPayLink, QuickPayLinkButton } from './quickpaylink';
import { Stripe, StripeButton } from './stripe';

export const Payments: React.FC = () => {
    const { state, _t } = useAppContext();
    const paymentMethods = state.crystalPayments;
    const paymentMethodImplementations = {
        crystalCoin: {
            name: 'Crystal Coin',
            component: CrystalCoin,
            button: CrystalCoinButton,
            renderOnLoad: true,
            enabled: state.paymentImplementations.includes('crystal') && paymentMethods.includes('coin'),
        },
        crystalCard: {
            name: 'Crystal Card',
            component: CrystalCard,
            button: CrystalCardButton,
            renderOnLoad: false,
            enabled: state.paymentImplementations.includes('crystal') && paymentMethods.includes('card'),
        },
        quickPayLink: {
            name: 'QuickPay',
            component: QuickPayLink,
            button: QuickPayLinkButton,
            renderOnLoad: true,
            enabled: state.paymentImplementations.includes('quickpay'),
        },
        stripe: {
            name: 'Stripe',
            component: Stripe,
            button: StripeButton,
            renderOnLoad: false,
            enabled: state.paymentImplementations.includes('stripe'),
        },
        klarna: {
            name: 'Klarna',
            component: Klarna,
            button: KlarnaButton,
            renderOnLoad: false,
            enabled: state.paymentImplementations.includes('klarna'),
        },
    };
    const [selectedPaymentMethodImplementation, setSelectedPaymentMethodImplementation] = useState<string | null>(null);

    if (selectedPaymentMethodImplementation) {
        const implementation =
            paymentMethodImplementations[
                selectedPaymentMethodImplementation as keyof typeof paymentMethodImplementations
            ];
        return (
            <div className="payment-method mb-4 bg-grey mt-5 rounded p-6 ">
                <implementation.component />
            </div>
        );
    }

    return (
        <>
            <h2 className="font-bold text-2xl mt-5 mb-1">{_t('payment.title')}</h2>

            <br />
            <div className="grid grid-cols-1 gap-1">
                {Object.keys(paymentMethodImplementations).map((implementationKey) => {
                    const implementation =
                        paymentMethodImplementations[implementationKey as keyof typeof paymentMethodImplementations];
                    if (!implementation.enabled) {
                        return null;
                    }
                    if (implementation.renderOnLoad) {
                        return <implementation.component key={implementationKey} />;
                    }
                    return (
                        <implementation.button
                            key={implementationKey}
                            onClick={() => setSelectedPaymentMethodImplementation(implementationKey)}
                        />
                    );
                })}
            </div>
        </>
    );
};