import { getJson, postJson } from '@crystallize/reactjs-hooks';
import { Customer } from '~/core/components/checkout-forms/address';
import { LocalCart } from '~/core/hooks/useLocalCart';
import { sendPaidOrderWithCrystalCard, sendPaidOrderWithCrystalCoin } from './payments/crystal';

export function placeCart(serviceApiUrl: string, language: string, cart: LocalCart, customer: Partial<Customer>) {
    return postJson<any>(serviceApiUrl + '/cart/place', {
        cartId: cart.cartId,
        locale: language,
        items: Object.values(cart.items),
        customer,
    });
}

export const ServiceAPI = (locale: string, serviceApiUrl: string) => {
    const language = locale.split('-')[0];
    return {
        stripe: {
            fetchPaymentIntent: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/stripe/intent/create', { cartId: cart.cartId }),
        },
        quickpay: {
            fetchPaymentLink: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/quickpay/link/create', { cartId: cart.cartId }),
        },
        klarna: {
            initiatePayment: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/klarna/payment/create', { cartId: cart.cartId }),
        },
        fetchOrders: () => getJson<any>(serviceApiUrl + '/orders'),
        fetchOrder: (orderId: string) => getJson<any>(serviceApiUrl + '/orders/' + orderId),
        placeCart: (cart: LocalCart, customer: Partial<Customer>) => placeCart(serviceApiUrl, language, cart, customer),
        registerAndSendMagickLink: (userInfos: any) => postJson<any>(serviceApiUrl + '/magicklink/register', userInfos),
        sendMagickLink: (email: string, callbackPath: string) =>
            postJson<any>(serviceApiUrl + '/magicklink/register?callbackPath=' + callbackPath, {
                email,
                firstname: '',
                lastname: '',
            }),
        fetchCart: (cartId: string) => getJson<any>(serviceApiUrl + '/cart/' + cartId),
        fetchRemoteCart: (cart: LocalCart) =>
            postJson<any>(serviceApiUrl + '/cart', {
                locale: language,
                items: Object.values(cart.items),
                cartId: cart.cartId,
                withImages: true,
            }),
        // THIS SHOULD BE REMOVED IN A REAL PROJECT
        sendPaidOrderWithCrystalCoin: (cart: LocalCart, customer: Partial<Customer>) =>
            sendPaidOrderWithCrystalCoin(serviceApiUrl, language, cart, customer),
        // THIS SHOULD BE REMOVED IN A REAL PROJECT
        sendPaidOrderWithCrystalCard: (cart: LocalCart, customer: Partial<Customer>, card: any) =>
            sendPaidOrderWithCrystalCard(serviceApiUrl, language, cart, customer, card),
    };
};
