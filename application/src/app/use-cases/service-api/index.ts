import { getJson, postJson } from '@crystallize/reactjs-hooks';
import { Customer } from '~/core/components/checkout-forms/address';
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
    sendPaidOrder,
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
    return await getJson<any>(window.ENV.SERVICE_API_URL + '/orders/' + orderId);
}

// in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
async function sendPaidOrder(cart: LocalCart, customer?: Partial<Customer>) {
    const cartWrapper = await placeCart(cart, customer);
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/crystalcoin/confirmed', {
        cartId: cartWrapper.cartId,
    });
}

async function placeCart(cart: LocalCart, customer?: Partial<Customer>) {
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/cart/place', {
        cartId: cart.cartId,
        locale: 'en',
        items: Object.values(cart.items),
        customer,
    });
}

async function registerAndSendMagickLink(userInfos: any) {
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/magicklink/register', userInfos);
}

async function sendMagickLink(email: string, callbackPath: string) {
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/magicklink/register?callbackPath=' + callbackPath, {
        email,
        firstname: '',
        lastname: '',
    });
}

async function fetchCart(cartId: string) {
    return await getJson<any>(window.ENV.SERVICE_API_URL + '/cart/' + cartId);
}
