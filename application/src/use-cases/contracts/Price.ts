import { Currency } from './Currency';

export type Price = {
    currency: Currency;
    value: number;
    identifier: string;
    name: string;
};
