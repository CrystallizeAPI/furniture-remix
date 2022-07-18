import {
    createOrderPusher,
    CustomerInputRequest,
    OrderCreatedConfirmation,
    PaymentInputRequest,
} from '@crystallize/js-api-client';
import { TStoreFront } from '@crystallize/js-storefrontaware-utils';
import { CartItem, CartWrapper } from '@crystallize/node-service-api-request-handlers';
import { cartWrapperRepository } from '~/core-server/services.server';

export const pushOrderSubHandler = async (
    storeFront: TStoreFront,
    cartWrapper: CartWrapper,
    customer: CustomerInputRequest,
    payment: PaymentInputRequest,
): Promise<OrderCreatedConfirmation> => {
    const cart = cartWrapper.cart;
    if (cartWrapper?.extra?.orderId) {
        throw {
            message: `Order '${cartWrapper.extra.orderId}' already exists.`,
            status: 403,
        };
    }
    const pusher = createOrderPusher(storeFront.apiClient);
    const orderCreatedConfirmation = await pusher({
        customer,
        cart: cart.cart.items.map((item: CartItem) => {
            return {
                sku: item.variant.sku,
                name: item.variant.name || item.variant.sku,
                quantity: item.quantity,
                imageUrl: item.variant.firstImage?.url || '',
                price: {
                    gross: item.price.gross,
                    net: item.price.net,
                    currency: item.price.currency,
                    tax: {
                        name: 'Exempt',
                        percent: 0,
                    },
                },
            };
        }),
        total: {
            currency: cart.total.currency,
            gross: cart.total.gross,
            net: cart.total.net,
            tax: {
                name: 'VAT',
                percent: (cart.total.net / cart.total.gross - 1) * 100,
            },
        },
        payment: [payment],
    });
    cartWrapperRepository.attachOrderId(cartWrapper, orderCreatedConfirmation.id);
    return orderCreatedConfirmation;
};

export const buildCustomer = (cartWrapper: CartWrapper): CustomerInputRequest => {
    return {
        identifier: cartWrapper?.customer?.email || '',
        email: cartWrapper?.customer?.email || '',
        firstName: cartWrapper?.customer?.firstname || 'Unknown',
        lastName: cartWrapper?.customer?.lastname || 'Unknown',
        companyName: cartWrapper?.customer?.company || 'Unknown',
        addresses: [
            {
                //@ts-ignore
                type: 'billing',
                street: cartWrapper?.customer?.streetAddress || 'Unknown',
                city: cartWrapper?.customer?.city || 'Unknown',
                country: 'Unknown',
                state: 'Unknown',
                postalCode: cartWrapper?.customer?.zipCode || 'Unknown',
            },
            {
                //@ts-ignore
                type: 'delivery',
                street: cartWrapper?.customer?.streetAddress || 'Unknown',
                city: cartWrapper?.customer?.city || 'Unknown',
                country: 'Unknown',
                state: 'Unknown',
                postalCode: cartWrapper?.customer?.zipCode || 'Unknown',
            },
        ],
    };
};
