import { createClient, createProductHydrater } from "@crystallize/js-api-client";
import { Cart, CartHydraterArguments, CartPayload, cartPayload, CartWrapper, handleCartRequestPayload } from "@crystallize/node-service-api-request-handlers"
import { StandardRouting, validatePayload, ValidatingRequestRouting } from "@crystallize/node-service-api-router"
import Koa from 'koa';
import { v4 as uuidv4 } from 'uuid';
import { cartWrapperRepository } from "../services";

export const cartBodyConvertedRoutes: ValidatingRequestRouting = {
    '/cart': {
        post: {
            schema: cartPayload,
            handler: handleCartRequestPayload,
            args: (context: Koa.Context): CartHydraterArguments => {
                return {
                    hydraterBySkus: createProductHydrater(context.superFast.apiClient).bySkus,
                    perVariant: () => {
                        return {
                            id: true
                        }
                    }
                }
            }
        }
    }
}

async function handleAndSaveCart(cart: Cart, providedCartId: string): Promise<CartWrapper> {
    let cartId = providedCartId;
    let cartWrapper = null, storedCartWrapper = null;
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

    if (!cartWrapperRepository.save(cartWrapper)) {
        return storedCartWrapper || cartWrapper;
    }
    return cartWrapper;
}

async function handleAndPlaceCart(cart: Cart, user: any, providedCartId: string): Promise<CartWrapper> {
    const cartWrapper = await handleAndSaveCart(cart, providedCartId);
    cartWrapper.customer = {
        identifier: user.aud
    };
    cartWrapperRepository.place(cartWrapper);
    return cartWrapper;
}

export const cartStandardRoutes: StandardRouting = {
    "/cart/:id": {
        get: {
            handler: async (ctx: Koa.Context) => {
                const cartWrapper = await cartWrapperRepository.find(ctx.params.id);
                if ((!cartWrapper)) {
                    throw {
                        message: `Cart '${ctx.params.id}' does not exist.`,
                        status: 404
                    }
                }
                ctx.response.body = cartWrapper;
            }
        }
    },
    "/cart": {
        post: {
            handler: async (ctx: Koa.Context) => {
                const cart = ctx.response.body as Cart;
                const cartWrapper = await handleAndSaveCart(cart, ctx.request.body.cartId as string);
                ctx.response.body = cartWrapper
            }
        }
    },
    // this is when we place the cart just before payment
    // we freeze the hydrate cart
    "/cart/place": {
        post: {
            authenticated: true,
            handler: async (ctx: Koa.Context) => {
                const request = validatePayload<CartPayload>(cartPayload, ctx.request.body);
                const cart = await handleCartRequestPayload(request, {
                    hydraterBySkus: createProductHydrater(ctx.superFast.apiClient).bySkus,
                });
                ctx.body = await handleAndPlaceCart(cart, ctx.user, ctx.request.body.cartId as string);
            }
        }
    }
};


