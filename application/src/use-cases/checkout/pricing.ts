import { ProductVariant } from '../contracts/ProductVariant';
import { Currency, CurrencyCode, getCurrencyFromCode } from '../contracts/Currency';

export type DisplayPrice = {
    default: number;
    discounted?: number;
    percent: number;
    currency: Currency;
    marketPrice?: number;
};

/** @todo: MUST be EXTRACTED: as it used the Local to Project Type */
export default function displayPriceFor(
    variant: ProductVariant,
    identifiers: { default: string; discounted: string } = {
        default: 'default',
        discounted: 'sales',
    },
    currencyCode: CurrencyCode,
    discount?: {
        amount: number;
    },
): DisplayPrice {
    const priceVariants = variant?.priceVariants;
    const currency = getCurrencyFromCode(currencyCode);
    if (!priceVariants) {
        return {
            default: 0.0,
            percent: 0.0,
            currency,
        };
    }

    const defaultPrice =
        priceVariants[identifiers.default] && priceVariants[identifiers.default].currency.code === currency.code
            ? priceVariants[identifiers.default].value
            : 0.0;

    const marketPrice =
        priceVariants[identifiers.default] && priceVariants[identifiers.default].currency.code === currency.code
            ? priceVariants[identifiers.default].priceFor.price
            : 0.0;

    let discountedPrice =
        discount?.amount ||
        (priceVariants[identifiers.discounted] && priceVariants[identifiers.discounted].currency.code === currency.code)
            ? priceVariants[identifiers.discounted].value
            : undefined;

    if (marketPrice && marketPrice < defaultPrice) {
        discountedPrice = marketPrice;
    }

    return {
        default: defaultPrice,
        discounted: discountedPrice,
        percent:
            defaultPrice > 0 && discountedPrice
                ? Math.round(((defaultPrice - discountedPrice!) / defaultPrice) * 100)
                : 0.0,
        currency,
        marketPrice,
    };
}
