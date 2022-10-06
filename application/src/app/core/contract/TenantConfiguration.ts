export type PaymentImplementation = 'crystal' | 'stripe' | 'quickpay';
export type CrystalFakePaymentImplementation = 'card' | 'coin';
export type TenantConfiguration = {
    currency: string;
    logo?: {
        key: string;
        url: string;
        variants?: Array<{
            key: string;
            url: string;
            width: number;
            height: number;
        }>;
    };
    crystalPayments: CrystalFakePaymentImplementation[];
    paymentImplementations: PaymentImplementation[];
    paymentImplementationVariables?: Record<PaymentImplementation, Record<string, string>>;
};
