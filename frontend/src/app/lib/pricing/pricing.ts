import { ProductPriceVariant, ProductVariant } from '@crystallize/js-api-client';
import { Currency, CurrencyCode, getCurrencyFromCode } from './currencies';

export type DisplayPrice = {
    default: number;
    discounted: number;
    percent: number;
    currency: Currency;
};

export default function displayPriceFor(
    variant: ProductVariant,
    idenfiers: { default: string; discounted: string } = {
        default: 'default',
        discounted: 'sales',
    },
    currencyCode: CurrencyCode,
    discount?: {
        amount: number;
    },
): DisplayPrice {
    const priceVariants = variant.priceVariants;
    const currency = getCurrencyFromCode(currencyCode);
    if (!priceVariants) {
        return {
            default: variant.price!,
            discounted: 0,
            percent: 0,
            currency,
        };
    }

    const defaultPrice =
        priceVariants.find(
            (priceVariant: ProductPriceVariant) =>
                priceVariant.identifier === idenfiers.default &&
                priceVariant.currency?.toLocaleLowerCase() === currency.code.toLocaleLowerCase(),
        )?.price || 0;

    // if there is a forced discount we take it
    const discountedPrice = discount
        ? discount.amount
        : priceVariants.find(
              (priceVariant: ProductPriceVariant) =>
                  priceVariant.identifier === idenfiers.discounted &&
                  priceVariant.currency?.toLocaleLowerCase() === currency.code.toLocaleLowerCase(),
          )?.price || 0;

    if (discountedPrice <= 0) {
        return {
            default: defaultPrice,
            discounted: 0,
            percent: 0,
            currency,
        };
    }

    return {
        default: defaultPrice,
        discounted: discountedPrice,
        percent: Math.round(((defaultPrice - discountedPrice) / defaultPrice) * 100),
        currency,
    };
}
