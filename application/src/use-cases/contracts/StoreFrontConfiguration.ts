import { Currency } from './Currency';
import { TenantConfiguration } from './TenantConfiguration';

export type StoreFrontConfiguration = {
    crystallize: {
        tenantIdentifier: string;
    };
    language: string;
    locale: string;
    market?: string;
    theme: string;
    currency: Currency;
    serviceApiUrl: string;
} & Pick<TenantConfiguration, 'logo' | 'crystalPayments' | 'paymentImplementationVariables' | 'paymentImplementations'>;
