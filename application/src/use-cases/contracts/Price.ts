import { Currency } from './Currency';

export type Price = {
    priceFor: {
        identifier: string;
        price: number;
    };
    currency: Currency;
    value: number;
    identifier: string;
    name: string;
};
