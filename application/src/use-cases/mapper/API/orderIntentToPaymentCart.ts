import { CartWrapper } from '@crystallize/node-service-api-request-handlers';

export default (orderIntent: any): CartWrapper => {
    const { cart, customer, total } = orderIntent;

    const getValueFromMeta = (key: string) => orderIntent?.meta.find((meta: any) => meta.key === key)?.value;
    const cartId = getValueFromMeta('cartId');
    const state = getValueFromMeta('cartState');

    return {
        cartId,
        state,
        extra: {},
        cart: {
            total: {
                currency: total.currency.toUpperCase(),
                gross: total.gross,
                net: total.net,
                taxAmount: 0.0 ?? total.taxAmount,
            },
            cart: {
                items: cart.map((item: any) => ({
                    quantity: item.quantity,
                    price: {
                        currency: item.price.currency,
                        gross: item.price.gross,
                        net: item.price.net,
                        taxAmount: item.price.taxAmount ?? 0.0,
                    },
                    product: {
                        name: item.name,
                    },
                    variant: {
                        sku: item.sku,
                    },
                })),
            },
        },
        customer: {
            identifier: customer.identifier,
            firstName: customer.firstName,
            lastName: customer.lastName,
            addresses: customer.addresses.map((address: any) => ({
                type: address.type,
                street: address.street,
                postalCode: address.postalCode,
                city: address.city,
                country: address.country,
            })),
        },
    };
};
