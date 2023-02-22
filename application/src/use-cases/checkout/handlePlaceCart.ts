import { ClientInterface } from '@crystallize/js-api-client';
import { Cart, CartWrapper } from '@crystallize/node-service-api-request-handlers';
import { RequestContext } from '../http/utils';
import { cartWrapperRepository } from '../services.server';
import { hydrateCart } from './cart';
import { handleAndSaveCart } from './handleSaveCart';

export default async (apiClient: ClientInterface, context: RequestContext, body: any, customer: any) => {
    const [cart, voucher] = await hydrateCart(apiClient, context.language, body);
    return await handleAndPlaceCart(cart, customer, body.cartId as string, body.options, voucher);
};

async function handleAndPlaceCart(
    cart: Cart,
    customer: any,
    providedCartId: string,
    options?: any,
    voucher?: any,
): Promise<CartWrapper> {
    const cartWrapper = await handleAndSaveCart(cart, providedCartId, voucher);
    cartWrapper.customer = customer;
    cartWrapper.extra = {
        ...cartWrapper.extra,
        pickupPoint: options?.pickupPoint,
    };
    cartWrapperRepository.place(cartWrapper);
    return cartWrapper;
}
