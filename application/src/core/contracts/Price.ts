import { Currency } from '~/lib/pricing/currencies';

export type Price = {
    currency: Currency;
    value: number;
    identifier: string;
    name: string;
};
