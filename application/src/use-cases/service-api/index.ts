import { getJson, postJson } from '@crystallize/reactjs-hooks';
import { Customer } from '../contracts/Customer';
import { LocalCart } from '../contracts/LocalCart';
import { sendPaidOrderWithCrystalCard, sendPaidOrderWithCrystalCoin } from './payments/crystal';

export function placeCart(
    serviceApiUrl: string,
    language: string,
    cart: LocalCart,
    customer: Partial<Customer>,
    options?: { pickupPoint: any },
) {
    return postJson<any>(serviceApiUrl + '/cart/place', {
        cartId: cart.cartId,
        locale: language,
        items: Object.values(cart.items),
        customer,
        options,
        extra: cart.extra,
    });
}

export type ServiceAPIContext = {
    locale?: string;
    language: string;
    serviceApiUrl: string;
};

export const ServiceAPI = ({ locale, language, serviceApiUrl }: ServiceAPIContext) => {
    return {
        stripe: {
            fetchPaymentIntent: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/stripe/create', { cartId: cart.cartId }),
        },
        vipps: {
            fetchPaymentIntent: (cart: LocalCart, method: string, flow: string) =>
                postJson<any>(serviceApiUrl + '/payment/vipps/create?method=' + method + '&flow=' + flow, {
                    cartId: cart.cartId,
                }),
            initiateExpressCheckoutPaymentIntent: (items: { sku: string; quantity: number }[]) =>
                postJson<any>(serviceApiUrl + '/payment/vipps/buynow', {
                    locale: language,
                    items,
                }),
        },
        quickpay: {
            fetchPaymentLink: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/quickpay/create', { cartId: cart.cartId }),
        },
        montonio: {
            fetchPaymentLink: (cart: LocalCart, method: string) =>
                postJson<any>(serviceApiUrl + '/payment/montonio/create?method=' + method, { cartId: cart.cartId }),
            fetchPickupPoints: () => getJson<any>(serviceApiUrl + '/shipping/montonio/pickup-points'),
            fetchBanks: () => getJson<any>(serviceApiUrl + '/payment/montonio/payment-methods'),
        },
        klarna: {
            initiatePayment: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/klarna/create', { cartId: cart.cartId }),
        },
        razorpay: {
            initiatePayment: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/razorpay/create', { cartId: cart.cartId }),
            receivePayment: (baseUrl: string, payload: any) =>
                postJson<any>(baseUrl + '/api/webhook/payment/razorpay/verify', payload),
        },
        adyen: {
            initiatePayment: (cart: LocalCart) =>
                postJson<any>(serviceApiUrl + '/payment/adyen/create', { cartId: cart.cartId }),
            receivePayment: (baseUrl: string, payload: any) =>
                postJson<any>(baseUrl + '/api/webhook/payment/adyen', payload),
        },
        fetchOrders: () => getJson<any>(serviceApiUrl + '/orders'),
        fetchOrder: (orderId: string, cartId?: string) =>
            getJson<any>(serviceApiUrl + '/orders/' + orderId + (cartId ? '?cartId=' + cartId : '')),
        placeCart: (cart: LocalCart, customer: Partial<Customer>, options?: { pickupPoint: any }) =>
            placeCart(serviceApiUrl, language, cart, customer, options),
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
                extra: cart.extra,
            }),
        // THIS SHOULD BE REMOVED IN A REAL PROJECT
        sendPaidOrderWithCrystalCoin: (cart: LocalCart, customer: Partial<Customer>) =>
            sendPaidOrderWithCrystalCoin(serviceApiUrl, language, cart, customer),
        // THIS SHOULD BE REMOVED IN A REAL PROJECT
        sendPaidOrderWithCrystalCard: (cart: LocalCart, customer: Partial<Customer>, card: any) =>
            sendPaidOrderWithCrystalCard(serviceApiUrl, language, cart, customer, card),
    };
};
