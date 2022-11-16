import { ProductPriceVariant } from '@crystallize/js-api-client';
import { Price } from '~/use-cases/contracts/Price';
import { getCurrencyFromCode } from '~/ui/lib/pricing/currencies';

export default (variants: ProductPriceVariant[]): Record<string, Price> => {
    return variants.reduce((memo: Record<string, Price>, priceVariant: ProductPriceVariant) => {
        return {
            ...memo,
            [priceVariant.identifier]: {
                identifier: priceVariant.identifier,
                value: priceVariant.price || 0.0,
                currency: getCurrencyFromCode(priceVariant.currency || 'EUR'),
                name: priceVariant.name || 'Unkonwn',
            },
        };
    }, {});
};
