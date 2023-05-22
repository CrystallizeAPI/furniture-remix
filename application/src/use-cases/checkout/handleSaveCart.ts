import { ClientInterface } from '@crystallize/js-api-client';
import { CartWrapper } from '@crystallize/node-service-api-request-handlers';
import { Voucher } from '../contracts/Voucher';
import { RequestContext } from '../http/utils';
import { alterCartBasedOnDiscounts, hydrateCart } from './cart';
import { v4 as uuidv4 } from 'uuid';
import { cartWrapperRepository } from '../services.server';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';

export default async (
    storeFrontConfig: TStoreFrontConfig,
    apiClient: ClientInterface,
    context: RequestContext,
    body: any,
) => {
    const [cart, voucher] = await hydrateCart(storeFrontConfig, apiClient, context.language, body);
    return await handleAndSaveCart(cart, body.cartId as string, voucher);
};

export async function handleAndSaveCart(cart: any, providedCartId: string, voucher?: Voucher): Promise<CartWrapper> {
    let cartId = providedCartId;
    let cartWrapper: null | CartWrapper = null;
    let storedCartWrapper: null | CartWrapper = null;
    if (cartId) {
        storedCartWrapper = (await cartWrapperRepository.find(cartId)) || null;
    } else {
        cartId = uuidv4();
    }
    if (!storedCartWrapper) {
        (cartWrapper = cartWrapperRepository.create(cart, cartId)), { voucher };
    } else {
        cartWrapper = { ...storedCartWrapper };
        cartWrapper.cart = cart;
        cartWrapper.extra.voucher = voucher;
    }

    // handle discount
    cartWrapper = await alterCartBasedOnDiscounts(cartWrapper);

    if (!cartWrapperRepository.save(cartWrapper)) {
        return storedCartWrapper || cartWrapper;
    }
    return cartWrapper;
}
