import { TenantConfiguration } from './TenantConfiguration';

export type PaymentImplementation =
    | 'crystal'
    | 'stripe'
    | 'quickpay'
    | 'klarna'
    | 'razorpay'
    | 'montonio'
    | 'adyen'
    | 'vipps'
    | 'dintero';
export type CrystalFakePaymentImplementation = 'card' | 'coin';

export type StoreFrontConfiguration = {
    crystallize: {
        tenantIdentifier: string;
        tenantId: string;
    };
    language: string;
    locale: string;
    market?: string;
    theme: string;
    serviceApiUrl: string;
    crystalPayments: CrystalFakePaymentImplementation[];
    paymentImplementations: PaymentImplementation[];
    paymentImplementationVariables?: Partial<Record<PaymentImplementation, Record<string, string>>>;
} & TenantConfiguration;
