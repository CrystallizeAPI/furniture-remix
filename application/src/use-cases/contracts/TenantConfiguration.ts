export type PaymentImplementation = 'crystal' | 'stripe' | 'quickpay' | 'klarna' | 'razorpay';
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
    paymentImplementationVariables?: Partial<Record<PaymentImplementation, Record<string, string>>>;
};
