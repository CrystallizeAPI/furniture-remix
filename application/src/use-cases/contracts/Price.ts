import { Currency } from '~/ui/lib/pricing/currencies';

export type Price = {
    currency: Currency;
    value: number;
    identifier: string;
    name: string;
};
