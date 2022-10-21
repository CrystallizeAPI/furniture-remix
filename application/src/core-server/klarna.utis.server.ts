import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { Cart } from '@crystallize/node-service-api-request-handlers';

export const getKlarnaVariables = (currency: string, storefrontConfig?: TStoreFrontConfig) => {
    let klarnaLocale = {
        locale: 'en-US',
        country: 'US',
        currency: 'USD',
    };
    const origin =
        process.env.KLARNA_ORIGIN ?? storefrontConfig?.configuration?.KLARNA_ORIGIN ?? 'api.playground.klarna.com';
    // boilerplate opinionated code to simplify
    // klarna is really strict on the Country / Currency / Locale mapping on a specific origin...
    // so we need to map the currency to a country and locale
    if (origin !== 'api-na.playground.klarna.com') {
        klarnaLocale = {
            locale: currency === 'NOK' ? 'en-NO' : currency === 'USD' ? 'en-US' : 'en-FR',
            country: currency === 'NOK' ? 'NO' : currency === 'USD' ? 'US' : 'FR',
            currency: currency,
        };
    }
    return {
        locale: klarnaLocale,
        origin,
    };
};

export const getKlarnaOrderInfos = (cart: Cart) => {
    const currency = cart.total.currency.toUpperCase();
    const { locale } = getKlarnaVariables(currency);
    return {
        amount: cart.total.gross * 100,
        currency: locale.currency,
        order_lines: cart.cart.items.map((item) => {
            const discountAmount =
                item.price.discounts?.map((discount) => discount.amount).reduce((a, b) => a + b, 0) ?? 0;
            return {
                name: item.variant.name || item.variant.sku,
                quantity: item.quantity,
                total_amount: item.price.gross * 100,
                total_discount_amount: discountAmount * 100,
                unit_price: (item.price.gross / item.quantity + discountAmount) * 100,
            };
        }),
    };
};
