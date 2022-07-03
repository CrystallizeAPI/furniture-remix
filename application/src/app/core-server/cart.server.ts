import { Cart, CartWrapper, Price } from '@crystallize/node-service-api-request-handlers';
import { extractDisountLotFromItemsBasedOnXForYTopic, groupSavingsPerSkus } from './discount.server';
import { cartWrapperRepository } from './services.server';
import { v4 as uuidv4 } from 'uuid';

function alterCartBasedOnDiscounts(wrapper: CartWrapper): CartWrapper {
    const { cart, total } = wrapper.cart;
    const lots = extractDisountLotFromItemsBasedOnXForYTopic(cart.items);
    const savings = groupSavingsPerSkus(lots);

    let totals: Price = {
        gross: 0,
        currency: 'EUR',
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
        const grossAmount = item.price.gross - (saving?.amount || 0);
        const taxAmount = (grossAmount * (item.product?.vatType?.percent || 0)) / 100;
        const netAmount = grossAmount + taxAmount;
        const discount = {
            amount: saving?.amount || 0,
            percent: ((saving?.amount || 0) / grossAmount) * 100,
        };
        totals.taxAmount += taxAmount;
        totals.gross += grossAmount;
        totals.net += netAmount;
        totals.currency = total.currency;
        totals.discounts![0].amount += saving?.amount || 0;
        return {
            ...item,
            price: {
                gross: grossAmount,
                net: netAmount,
                currency: item.price.currency,
                taxAmount,
                discounts: [discount],
            },
        };
    });

    return {
        ...wrapper,
        cart: {
            total: totals,
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
