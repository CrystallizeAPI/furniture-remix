import { postJson } from '@crystallize/reactjs-hooks';
import { Customer } from '~/core/components/checkout-forms/address';
import { LocalCart } from '~/core/hooks/useLocalCart';
import { placeCart } from '..';

// /!\ in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
// THIS SHOULD BE REMOVED IN A REAL PROJECT
export async function sendPaidOrderWithCrystalCoin(cart: LocalCart, customer: Partial<Customer>) {
    const cartWrapper = await placeCart(cart, customer);
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/crystal/coin/confirmed', {
        cartId: cartWrapper.cartId,
    });
}

// /!\ in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
// THIS SHOULD BE REMOVED IN A REAL PROJECT
export async function sendPaidOrderWithCrystalCard(cart: LocalCart, customer: Partial<Customer>, card: any) {
    const cartWrapper = await placeCart(cart, customer);
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/crystal/card/confirmed', {
        cartId: cartWrapper.cartId,
        card,
    });
}
