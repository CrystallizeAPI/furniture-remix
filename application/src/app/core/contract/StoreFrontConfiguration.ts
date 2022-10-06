import { Currency } from '~/lib/pricing/currencies';
import { TenantConfiguration } from './TenantConfiguration';

export type StoreFrontConfiguration = {
    crystallize: {
        tenantIdentifier: string;
    };
    language: string;
    locale: string;
    theme: string;
    currency: Currency;
    serviceApiUrl: string;
} & Pick<TenantConfiguration, 'logo' | 'crystalPayments' | 'paymentImplementationVariables' | 'paymentImplementations'>;
