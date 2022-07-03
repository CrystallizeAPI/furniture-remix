import { getJson, postJson } from '@crystallize/reactjs-hooks';
import { Guest } from '~/core/components/checkout-forms/guest';
import { LocalCart } from '~/core/hooks/useLocalCart';

declare global {
    interface Window {
        ENV: Record<string, string>;
    }
}

export const ServiceAPI = {
    fetchPaymentIntent,
    fetchOrders,
    fetchOrder,
    sendAuthPaidOrder,
    sendGuestPaidOrder,
    placeCart,
    registerAndSendMagickLink,
    sendMagickLink,
    fetchCart,
};

async function fetchPaymentIntent(cart: LocalCart): Promise<any> {
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/stripe/intent/create', { cartId: cart.cartId });
}

async function fetchOrders() {
    return await getJson<any>(window.ENV.SERVICE_API_URL + '/orders');
}

async function fetchOrder(orderId: string) {
    return await getJson<any>(window.ENV.SERVICE_API_URL + '/order/' + orderId);
}

// in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
async function sendAuthPaidOrder(cart: LocalCart) {
    const cartWrapper = await placeCart(cart);
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/crystalcoin/confirmed', {
        cartId: cartWrapper.cartId,
    });
}

// in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
async function sendGuestPaidOrder(cart: LocalCart, guest: Partial<Guest>) {
    const cartWrapper = await placeCart(cart, guest);
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/crystalcoin/confirmed', {
        cartId: cartWrapper.cartId,
    });
}

async function placeCart(cart: LocalCart, guest?: Partial<Guest>) {
    return await postJson<any>(window.ENV.SERVICE_API_URL + (guest ? '/guest' : '') + '/cart/place', {
        cartId: cart.cartId,
        locale: 'en',
        items: Object.values(cart.items),
        guest,
    });
}

async function registerAndSendMagickLink(userInfos: any) {
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/register/email/magicklink', userInfos);
}

async function sendMagickLink(email: string, callbackPath: string) {
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/register/email/magicklink?callbackPath=' + callbackPath, {
        email,
        firstname: '',
        lastname: '',
    });
}

async function fetchCart(cartId: string) {
    return await getJson<any>(window.ENV.SERVICE_API_URL + '/cart/' + cartId);
}
