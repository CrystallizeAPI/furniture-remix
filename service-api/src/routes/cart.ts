import { createProductHydrater } from '@crystallize/js-api-client';
import {
    Cart,
    CartHydraterArguments,
    CartPayload,
    cartPayload,
    CartWrapper,
    handleCartRequestPayload,
    Price,
} from '@crystallize/node-service-api-request-handlers';
import { StandardRouting, validatePayload, ValidatingRequestRouting } from '@crystallize/node-service-api-router';
import Koa from 'koa';
import { v4 as uuidv4 } from 'uuid';
import { extractDisountLotFromItemsBasedOnXForYTopic, groupSavingsPerSkus, TDItem } from '../core/discount';
import { cartWrapperRepository } from '../services';

export const cartBodyConvertedRoutes: ValidatingRequestRouting = {
    '/cart': {
        post: {
            schema: cartPayload,
            handler: handleCartRequestPayload,
            args: (context: Koa.Context): CartHydraterArguments => {
                return {
                    hydraterBySkus: createProductHydrater(context.storeFront.apiClient).bySkus,
                    perProduct: () => {
                        return {
                            topics: {
                                name: true,
                            },
                        };
                    },
                };
            },
        },
    },
};

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

async function handleAndSaveCart(cart: Cart, providedCartId: string): Promise<CartWrapper> {
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

async function handleAndPlaceCart(cart: Cart, customer: any, providedCartId: string): Promise<CartWrapper> {
    const cartWrapper = await handleAndSaveCart(cart, providedCartId);
    cartWrapper.customer = customer;
    cartWrapperRepository.place(cartWrapper);
    return cartWrapper;
}

export const cartStandardRoutes: StandardRouting = {
    '/cart/:id': {
        get: {
            handler: async (ctx: Koa.Context) => {
                const cartWrapper = await cartWrapperRepository.find(ctx.params.id);
                if (!cartWrapper) {
                    throw {
                        message: `Cart '${ctx.params.id}' does not exist.`,
                        status: 404,
                    };
                }
                ctx.response.body = cartWrapper;
            },
        },
    },
    '/cart': {
        post: {
            handler: async (ctx: Koa.Context) => {
                const cart = ctx.response.body as Cart;
                const cartWrapper = await handleAndSaveCart(cart, ctx.request.body.cartId as string);
                ctx.response.body = cartWrapper;
            },
        },
    },
    // this is when we place the cart just before payment
    // we freeze the hydrate cart
    '/cart/place': {
        post: {
            authenticated: true,
            handler: async (ctx: Koa.Context) => {
                const request = validatePayload<CartPayload>(cartPayload, ctx.request.body);
                const cart = await handleCartRequestPayload(request, {
                    hydraterBySkus: createProductHydrater(ctx.storeFront.apiClient).bySkus,
                    perVariant: () => {
                        return {
                            firstImage: {
                                url: true,
                            },
                        };
                    },
                });
                const customer = {
                    identifier: ctx.user.aud,
                };
                ctx.body = await handleAndPlaceCart(cart, customer, ctx.request.body.cartId as string);
            },
        },
    },
    '/guest/cart/place': {
        post: {
            authenticated: false,
            handler: async (ctx: Koa.Context) => {
                const request = validatePayload<CartPayload>(cartPayload, ctx.request.body);
                const cart = await handleCartRequestPayload(request, {
                    hydraterBySkus: createProductHydrater(ctx.storeFront.apiClient).bySkus,
                    perVariant: () => {
                        return {
                            firstImage: {
                                url: true,
                            },
                        };
                    },
                });
                const customer = {
                    ...ctx.request.body.guest,
                    isGuest: true,
                };
                ctx.body = await handleAndPlaceCart(cart, customer, ctx.request.body.cartId as string);
            },
        },
    },
};
