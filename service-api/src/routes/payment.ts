import { CrystallizeOrderPusher, CustomerInputRequest, OrderCreatedConfirmation, PaymentInputRequest } from "@crystallize/js-api-client";
import { Cart, CartItem, stripePaymentIntentPayload, handleStripeCreatePaymentIntentRequestPayload, StripePaymentIntentArguments, StripePaymentIntentWebhookArguments, handleStripePaymentIntentWebhookRequestPayload, CartWrapper } from "@crystallize/node-service-api-request-handlers";
import { StandardRouting, ValidatingRequestRouting } from "@crystallize/node-service-api-router";
import Koa from 'koa';
import { cartWrapperRepository } from "../services";

const pushOrderSubHandler = async (cartWrapper: CartWrapper, customer: CustomerInputRequest, payment: PaymentInputRequest): Promise<OrderCreatedConfirmation> => {
    const cart = cartWrapper.cart;
    if (cartWrapper?.extra?.orderId) {
        throw {
            message: `Order '${cartWrapper.extra.orderId}' already exists.`,
            status: 403
        }
    }
    const orderCreatedConfirmation = await CrystallizeOrderPusher({
        customer,
        cart: cart.cart.items.map((item: CartItem) => {
            return {
                sku: item.variant.sku,
                name: item.variant.name || item.variant.sku,
                quantity: item.quantity,
                price: {
                    gross: item.price.gross,
                    net: item.price.net,
                    currency: 'EUR',
                    tax: {
                        name: 'Exempt',
                        percent: 0
                    }
                }
            }
        }),
        total: {
            currency: 'EUR',
            gross: cart.total.gross,
            net: cart.total.net,
            tax: {
                name: 'VAT',
                percent: (cart.total.net / cart.total.gross - 1) * 100,
            }
        },
        payment: [payment]
    });
    cartWrapperRepository.attachOrderId(cartWrapper, orderCreatedConfirmation.id);
    return orderCreatedConfirmation;
}


const buildCustomer = (cartWrapper: CartWrapper): CustomerInputRequest => {
    return {
        identifier: cartWrapper.customer.identifier,
        firstName: "William",
        lastName: "Wallace",
        companyName: "Freedom Inc.",
        addresses: [
            {
                //@ts-ignore
                type: "billing",
                street: "845 Market St",
                city: "San Francisco",
                country: "USA",
                state: "CA",
                postalCode: "94103"
            },
            {
                //@ts-ignore
                type: "delivery",
                street: "845 Market St",
                city: "San Francisco",
                country: "USA",
                state: "CA",
                postalCode: "94103"
            }
        ]
    }
};

export const paymentBodyConvertedRoutes: ValidatingRequestRouting = {
    // Get the Intent for Strip Payment
    "/payment/stripe/intent/create": {
        post: {
            schema: stripePaymentIntentPayload,
            authenticated: true,
            handler: handleStripeCreatePaymentIntentRequestPayload,
            args: (context: Koa.Context): StripePaymentIntentArguments => {
                return {
                    secret_key: `${process.env.STRIPE_SECRET_KEY}`,
                    fetchCart: async () => {
                        const cartId = context.request.body.cartId as string;
                        const cartWrapper = await cartWrapperRepository.find(cartId);
                        if (!cartWrapper) {
                            throw {
                                message: `Cart '${cartId}' does not exist.`,
                                status: 404
                            };
                        }
                        return cartWrapper.cart;
                    },
                    createIntentArguments: (cart: Cart) => {
                        const cartId = context.request.body.cartId as string;
                        return {
                            amount: cart.total.net * 100, // in cents (not sure here if this is correct)
                            currency: cart.total.currency,
                            metatdata: {
                                cartId
                            }
                        }
                    }
                };
            }
        }
    },
    "/payment/stripe/intent/webhook": {
        post: {
            handler: handleStripePaymentIntentWebhookRequestPayload,
            args: (context: Koa.Context): StripePaymentIntentWebhookArguments => {
                return {
                    secret_key: `${process.env.STRIPE_SECRET_KEY}`,
                    endpointSecret: `${process.env.STRIPE_SECRET_PAYMENT_INTENT_WEBHOOK_ENDPOINT_SECRET}`,
                    signature: context.request.headers["stripe-signature"] as string,
                    rawBody: context.request.rawBody,
                    handleEvent: async (eventName: string, event: any) => {
                        const cartId = event.data.object.metadata.cartId;
                        switch (eventName) {
                            case "payment_intent.succeeded":
                                const cartWrapper = await cartWrapperRepository.find(cartId);
                                if (!cartWrapper) {
                                    throw {
                                        message: `Cart '${cartId}' does not exist.`,
                                        status: 404
                                    };
                                };
                                const orderCreatedConfirmation = await pushOrderSubHandler(
                                    cartWrapper,
                                    buildCustomer(cartWrapper),
                                    {
                                        //@ts-ignore
                                        provider: 'stripe',
                                        stripe: {
                                            paymentIntentId: event.data.object.id,
                                            paymentMethod: event.data.object.charges.data[0].payment_method_details.type,
                                            stripe: `eventId:${event.id}`,
                                            metadata: event.data.object.charges.data[0].receipt_url
                                        }
                                    });
                                return orderCreatedConfirmation;
                        }
                    }
                }
            }
        }
    }
};

export const paymentStandardRoutes: StandardRouting = {
    // Fake payment callback endpoint called directly from the browser!!!!
    // ONLY for DEMO PURPOSES!!!
    "/payment/crystalcoin/confirmed": {
        post: {
            authenticated: true,
            handler: async (ctx: Koa.Context) => {
                const cartId = ctx.request.body.cartId as string;
                const cartWrapper = await cartWrapperRepository.find(cartId);
                if (!cartWrapper) {
                    throw {
                        message: `Cart '${cartId}' does not exist.`,
                        status: 404
                    }
                }
                const orderCreatedConfirmation = await pushOrderSubHandler(
                    cartWrapper,
                    buildCustomer(cartWrapper),
                    {
                        //@ts-ignore
                        provider: 'custom',
                        custom: {
                            properties: [
                                {
                                    property: 'payment_method',
                                    value: 'Crystallize Coin'
                                },
                                {
                                    property: 'amount',
                                    value: cartWrapper.cart.total.net.toFixed(2)
                                }
                            ]
                        }
                    });
                ctx.response.status = 201;
                ctx.response.body = orderCreatedConfirmation;
            }
        },
    }
}
