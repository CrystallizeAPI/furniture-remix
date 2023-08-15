import {
    Cart,
    cartPayload,
    CartPayload,
    CartWrapper,
    handleCartRequestPayload,
    Price,
} from '@crystallize/node-service-api-request-handlers';
import { extractDisountLotFromItemsBasedOnXForYTopic, groupSavingsPerSkus } from './discount';
import { validatePayload } from '../http/utils';
import {
    ClientInterface,
    createProductHydrater,
    Product,
    ProductPriceVariant,
    ProductVariant,
} from '@crystallize/js-api-client';
import { CrystallizeAPI } from '../crystallize/read';
import { marketIdentifiersForUser } from '../marketIdentifiersForUser';
import { Voucher } from '../contracts/Voucher';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';

export async function alterCartBasedOnDiscounts(wrapper: CartWrapper): Promise<CartWrapper> {
    const { cart, total } = wrapper.cart;
    const lots = extractDisountLotFromItemsBasedOnXForYTopic(cart.items);
    const savings = groupSavingsPerSkus(lots);
    const existingDiscounts = total.discounts || [];
    const voucher = wrapper.extra?.voucher as Voucher | undefined;
    let newTotals: Price = {
        gross: 0,
        currency: total.currency,
        net: 0,
        taxAmount: 0,
        discounts: [
            {
                amount: 0,
                percent: 0,
            },
        ],
    };

    let voucherDiscount = {
        amount: 0,
        percent: 0,
    };

    const alteredItems = cart.items.map((item) => {
        const saving = savings[item.variant.sku]?.quantity > 0 ? savings[item.variant.sku] : null;
        const savingAmount = saving?.amount || 0;
        const netAmount = item.price.net - savingAmount;
        const taxAmount = (netAmount * (item.product?.vatType?.percent || 0)) / 100;
        const grossAmount = netAmount + taxAmount;
        const discount = {
            amount: savingAmount,
            percent: (savingAmount / (netAmount + savingAmount)) * 100,
        };
        newTotals.taxAmount += taxAmount;
        newTotals.gross += grossAmount;
        newTotals.net += netAmount;
        newTotals.discounts![0].amount += discount.amount;
        return {
            ...item,
            price: {
                gross: grossAmount,
                net: netAmount,
                currency: item.price.currency,
                taxAmount,
                discounts: item.price.discounts ? [...item.price.discounts, discount] : [discount],
            },
        };
    });

    // calculate the New Discout Percentage
    const newDiscounts = {
        amount: newTotals.discounts![0].amount,
        percent:
            ((newTotals.net + newTotals.discounts![0].amount - newTotals.net) /
                (newTotals.net + newTotals.discounts![0].amount)) *
            100,
    };

    if (voucher) {
        if (voucher.value.type === 'absolute') {
            voucherDiscount = {
                amount: voucher.value.number,
                percent: (voucher.value.number / newTotals.gross) * 100,
            };
        }
        if (voucher.value.type === 'percent') {
            voucherDiscount = {
                amount: (newTotals.gross * voucher.value.number) / 100,
                percent: voucher.value.number,
            };
        }
    }

    //REDUCE THE TOTALS BY THE VOUCHER DISCOUNT
    newTotals.net -= voucherDiscount?.amount;
    newTotals.gross = newTotals.net + newTotals.taxAmount;

    return {
        ...wrapper,
        cart: {
            total: {
                ...newTotals,
                discounts: [...existingDiscounts, newDiscounts, voucherDiscount],
            },
            cart: {
                items: alteredItems,
            },
        },
        extra: {
            ...wrapper.extra,
            discounts: {
                lots,
                savings,
            },
        },
    };
}

export async function hydrateCart(
    storeFrontConfig: TStoreFrontConfig,
    apiClient: ClientInterface,
    language: string,
    body: any,
): Promise<[Cart, Voucher | undefined]> {
    const api = CrystallizeAPI({
        apiClient,
        language,
    });
    const tenantConfig = await api.fetchTenantConfig(storeFrontConfig.tenantIdentifier);
    const currency = tenantConfig.currency.code;

    const marketIdentifiers = marketIdentifiersForUser(body.user);

    const pickStandardPrice = (
        product: Product,
        selectedVariant: ProductVariant,
        currency: string,
    ): ProductPriceVariant => {
        // opinionated: if we have a `default` Price we take it
        let variant = selectedVariant?.priceVariants?.find(
            (price: ProductPriceVariant) =>
                price?.identifier === 'default' &&
                price?.currency?.toLocaleLowerCase() === currency.toLocaleLowerCase(),
        );

        //if we have a market price, we take that
        if (variant?.priceFor?.price && variant?.priceFor?.price < variant?.price!) {
            variant.price = variant?.priceFor?.price;
        }

        return (
            variant ??
            selectedVariant?.priceVariants?.[0] ?? {
                price: selectedVariant?.price,
                identifier: 'undefined',
            }
        );
    };

    const cart = await handleCartRequestPayload(validatePayload<CartPayload>(body, cartPayload), {
        pricesHaveTaxesIncludedInCrystallize: storeFrontConfig.taxIncluded,
        hydraterBySkus: createProductHydrater(apiClient, { useSyncApiForSKUs: false, marketIdentifiers }).bySkus,
        currency,
        perProduct: () => {
            return {
                topics: {
                    name: true,
                },
            };
        },
        perVariant: () => {
            return {
                firstImage: {
                    url: true,
                    variants: {
                        url: true,
                        height: true,
                        width: true,
                    },
                },
            };
        },
        selectPriceVariant: (
            product: Product,
            selectedVariant: ProductVariant,
            currency: string,
        ): ProductPriceVariant => {
            // opinionated: if we have a `Sales` Price we take it
            const variant = selectedVariant?.priceVariants?.find(
                (price: ProductPriceVariant) =>
                    price?.identifier === 'sales' && price?.currency?.toLowerCase() === currency.toLocaleLowerCase(),
            );
            const standardPrice = pickStandardPrice(product, selectedVariant, currency);
            if (!variant) {
                return standardPrice;
            }

            if (!variant?.price) {
                return standardPrice;
            }

            return variant;
        },
        basePriceVariant: (
            product: Product,
            selectedVariant: ProductVariant,
            currency: string,
        ): ProductPriceVariant => {
            return pickStandardPrice(product, selectedVariant, currency);
        },
    });

    let voucher: Voucher | undefined;
    try {
        voucher = (await api.fetchVoucher(body.extra?.voucher)) as Voucher;
        if (voucher.isExpired) {
            voucher = undefined;
        }
    } catch (exception) {
        voucher = undefined;
    }

    return [cart, voucher];
}
