import { Currency } from './Currency';
export type TenantConfiguration = {
    currency: Currency;
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
};
