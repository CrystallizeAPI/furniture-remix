import {
    Cart,
    cartPayload,
    CartPayload,
    CartWrapper,
    handleCartRequestPayload,
    Price,
} from '@crystallize/node-service-api-request-handlers';
import { extractDisountLotFromItemsBasedOnXForYTopic, groupSavingsPerSkus } from './discount.server';
import { cartWrapperRepository } from './services.server';
import { v4 as uuidv4 } from 'uuid';
import { validatePayload } from './http-utils.server';
import {
    ClientInterface,
    createProductHydrater,
    Product,
    ProductPriceVariant,
    ProductVariant,
} from '@crystallize/js-api-client';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { useAppContext } from '~/core/app-context/provider';

function alterCartBasedOnDiscounts(wrapper: CartWrapper): CartWrapper {
    const { cart, total } = wrapper.cart;
    const lots = extractDisountLotFromItemsBasedOnXForYTopic(cart.items);
    const savings = groupSavingsPerSkus(lots);

    const existingDiscounts = total.discounts || [];

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

    const alteredItems = cart.items.map((item) => {
        const saving = savings[item.variant.sku]?.quantity > 0 ? savings[item.variant.sku] : null;
        const netAmount = item.price.net - (saving?.amount || 0);
        const taxAmount = (netAmount * (item.product?.vatType?.percent || 0)) / 100;
        const grossAmount = netAmount + taxAmount;
        const discount = {
            amount: saving?.amount || 0,
            percent: ((saving?.amount || 0) / (netAmount + (saving?.amount || 0))) * 100,
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

    return {
        ...wrapper,
        cart: {
            total: {
                ...newTotals,
                discounts: [
                    ...existingDiscounts,
                    {
                        amount: newTotals.discounts![0].amount,
                        percent: (1 - (newTotals.net + newTotals.discounts![0].amount) / newTotals.net) * 100,
                    },
                ],
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

export async function handleAndPlaceCart(cart: Cart, customer: any, providedCartId: string): Promise<CartWrapper> {
    const cartWrapper = await handleAndSaveCart(cart, providedCartId);
    cartWrapper.customer = customer;
    cartWrapperRepository.place(cartWrapper);
    return cartWrapper;
}

export async function handleAndSaveCart(cart: Cart, providedCartId: string): Promise<CartWrapper> {
    let cartId = providedCartId;
    let cartWrapper = null,
        storedCartWrapper = null;
    if (cartId) {
        storedCartWrapper = await cartWrapperRepository.find(cartId);
    } else {
        cartId = uuidv4();
    }
    if (!storedCartWrapper) {
        cartWrapper = cartWrapperRepository.create(cart, cartId);
    } else {
        cartWrapper = { ...storedCartWrapper };
        cartWrapper.cart = cart;
    }

    // handle discount
    cartWrapper = alterCartBasedOnDiscounts(cartWrapper);

    if (!cartWrapperRepository.save(cartWrapper)) {
        return storedCartWrapper || cartWrapper;
    }
    return cartWrapper;
}

export async function hydrateCart(apiClient: ClientInterface, language: string, body: any): Promise<Cart> {
    const api = CrystallizeAPI({
        apiClient,
        language,
    });
    const tenantConfig = await api.fetchTenantConfig(apiClient.config.tenantIdentifier);
    const currency = tenantConfig.currency;

    const pickStandardPrice = (
        product: Product,
        selectedVariant: ProductVariant,
        currency: string,
    ): ProductPriceVariant => {
        // opinionated: if we have a `default` Price we take it
        const variant = selectedVariant?.priceVariants?.find(
            (price: ProductPriceVariant) =>
                price?.identifier === 'default' &&
                price?.currency?.toLocaleLowerCase() === currency.toLocaleLowerCase(),
        );
        return (
            variant ??
            selectedVariant?.priceVariants?.[0] ?? {
                price: selectedVariant?.price,
                identifier: 'undefined',
            }
        );
    };

    return await handleCartRequestPayload(validatePayload<CartPayload>(body, cartPayload), {
        hydraterBySkus: createProductHydrater(apiClient).bySkus,
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
}
