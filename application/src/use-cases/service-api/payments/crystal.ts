import { postJson } from '@crystallize/reactjs-hooks';
import { Customer } from '../../contracts/Customer';
import { LocalCart } from '../../contracts/LocalCart';
import { placeCart } from '..';

// /!\ in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
// THIS SHOULD BE REMOVED IN A REAL PROJECT
export async function sendPaidOrderWithCrystalCoin(
    serviceApiUrl: string,
    language: string,
    cart: LocalCart,
    customer: Partial<Customer>,
) {
    const cartWrapper = await placeCart(serviceApiUrl, language, cart, customer);
    return await postJson<any>(serviceApiUrl + '/payment/crystal/coin/confirmed', {
        cartId: cartWrapper.cartId,
    });
}

// /!\ in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
// THIS SHOULD BE REMOVED IN A REAL PROJECT
export async function sendPaidOrderWithCrystalCard(
    serviceApiUrl: string,
    language: string,
    cart: LocalCart,
    customer: Partial<Customer>,
    card: any,
) {
    const cartWrapper = await placeCart(serviceApiUrl, language, cart, customer);
    return await postJson<any>(serviceApiUrl + '/payment/crystal/card/confirmed', {
        cartId: cartWrapper.cartId,
        card,
    });
}
