import {
    ClientInterface,
    createOrderPusher,
    OrderCustomerInputRequest,
    OrderCreatedConfirmation,
    PaymentInputRequest,
} from '@crystallize/js-api-client';
import { CartItem, CartWrapper, CartWrapperRepository } from '@crystallize/node-service-api-request-handlers';
import pushCustomerIfMissing from './pushCustomerIfMissing';

const buildCustomer = (cartWrapper: CartWrapper): OrderCustomerInputRequest => {
    const firstName = cartWrapper?.customer?.firstname || '';
    const lastName = cartWrapper?.customer?.lastname || '';
    const customerIdentifier = cartWrapper?.customer?.customerIdentifier || cartWrapper?.customer?.email || '';
    return {
        identifier: customerIdentifier,
        firstName,
        lastName,
        addresses: [
            {
                //@ts-ignore
                type: 'billing',
                firstName,
                lastName,
                email: cartWrapper?.customer?.email || '',
                street: cartWrapper?.customer?.streetAddress || '',
                city: cartWrapper?.customer?.city || '',
                country: cartWrapper?.customer?.country || '',
                postalCode: cartWrapper?.customer?.zipCode || '',
            },
            {
                //@ts-ignore
                type: 'delivery',
                firstName,
                lastName,
                email: cartWrapper?.customer?.email || '',
                street: cartWrapper?.customer?.streetAddress || '',
                city: cartWrapper?.customer?.city || '',
                country: cartWrapper?.customer?.country || '',
                postalCode: cartWrapper?.customer?.zipCode || '',
            },
        ],
    };
};

export default async (
    cartWrapperRepository: CartWrapperRepository,
    apiClient: ClientInterface,
    cartWrapper: CartWrapper,
    payment: PaymentInputRequest,
    metadata?: Record<string, string>,
): Promise<OrderCreatedConfirmation> => {
    const customer = buildCustomer(cartWrapper);
    pushCustomerIfMissing(apiClient, customer).catch(console.error);

    const cart = cartWrapper.cart;
    if (cartWrapper?.extra?.orderId) {
        throw {
            message: `Order '${cartWrapper.extra.orderId}' already exists.`,
            status: 403,
        };
    }

    const extendedMetaData: Record<string, string> = {
        'Additional info': cartWrapper?.customer?.additionalInfo || '',
        ...metadata,
    };

    const pusher = createOrderPusher(apiClient);

    const orderIntent = {
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
                    discounts:
                        item.price.discounts?.map((discount) => ({
                            percent: discount?.percent || 0.0,
                        })) || [],
                    tax: {
                        name: 'VAT',
                        percent: item.price.gross > 0 ? (item.price.net / item.price.gross - 1) * 100 : 0.0,
                    },
                },
            };
        }),
        total: {
            currency: cart.total.currency,
            gross: cart.total.gross,
            net: cart.total.net,
            discounts:
                cart.total.discounts?.map((discount) => ({
                    percent: discount?.percent || 0.0,
                })) || [],
            tax: {
                name: 'VAT',
                percent: (cart.total.net / cart.total.gross - 1) * 100,
            },
        },
        payment: [payment],
        meta: Object.keys(extendedMetaData).map((key) => ({ key, value: extendedMetaData[key] ?? '' })),
    };

    const orderCreatedConfirmation = await pusher(orderIntent);
    cartWrapperRepository.attachOrderId(cartWrapper, orderCreatedConfirmation.id);
    return orderCreatedConfirmation;
};
