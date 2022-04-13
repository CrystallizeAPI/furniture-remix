import { handleCartRequest, Cart, CartItem, cartRequest, MagickLinkUserInfosRequest, magickLinkUserInfosRequest, handleOrderConfirmationRequest, handleMagickLinkConfirmationRequest, handleMagickLinkRegisterRequest, CartRequest } from '@crystallize/node-service-api-request-handlers';
import { createServiceApiApp, validateRequest, ValidatingRequestRouting, StandardRouting, authenticatedMiddleware } from '@crystallize/node-service-api-router';
import { CrystallizeOrderPusher } from '@crystallize/js-api-client';
import Koa from 'koa';
import mjml2html from 'mjml';
import nodemailer from "nodemailer";
import { z, ZodError } from 'zod';

// A list of more standard routes
// it could also be used to extends the bodyConvertedRoutes response body
const routes: StandardRouting = {
    '/': {
        get: {
            handler: async (ctx: Koa.Context) => {
                ctx.body = { msg: `Crystallize Service API - Tenant ${process.env.CRYSTALLIZE_TENANT_IDENTIFIER}` };
            }
        },
    },
    '/echo': {
        post: {
            handler: async (ctx: Koa.Context) => {
                ctx.body = {
                    echoed: ctx.request.body
                }
            }
        }
    },
    '/authenticated/echo': {
        post: {
            authenticated: true,
            handler: async (ctx: Koa.Context) => {
                console.log("Authenticated echo Handler");
                ctx.body = {
                    echoed: ctx.request.body,
                    user: ctx.user
                }
            }
        }
    },
    "/logout": {
        get: {
            handler: async (ctx: Koa.Context) => {
                ctx.cookies.set('jwt', '', { httpOnly: true, secure: ctx.secure });
                ctx.body = {
                    message: "Logged out"
                }
            }
        }
    },
    // while you get and hydrated Cart Object in the Body by the middleware you can still enrich the response
    "/cart": {
        post: {
            handler: async (ctx: Koa.Context) => {
                const cart = ctx.body as Cart;
                ctx.body = {
                    ...cart,
                    hello: "world"
                }
            }
        }
    },
    // the logic of pushing the order to the Crystallize API will be more complex for you
    "/order": {
        post: {
            authenticated: true,
            handler: async (ctx: Koa.Context) => {
                try {
                    const request = validateRequest<CartRequest>(cartRequest, ctx.request.body);
                    const response = await handleCartRequest(request, ctx);
                    const orderCreatedConfirmation = await CrystallizeOrderPusher({
                        customer: {
                            firstName: 'William',
                            lastName: 'Wallace',
                            identifier: ctx.user
                        },
                        cart: response.cart.items.map((item: CartItem) => {
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
                            gross: response.total.gross,
                            net: response.total.net,
                            tax: {
                                name: 'VAT',
                                percent: (response.total.net / response.total.gross - 1) * 100,
                            }
                        },
                        payment: [
                            {
                                //@ts-ignore
                                provider: 'custom',
                                custom: {
                                    properties: [
                                        {
                                            property: 'payment_method',
                                            value: 'Plopix Coin'
                                        },
                                        {
                                            property: 'amount',
                                            value: response.total.net.toFixed(2)
                                        }
                                    ]
                                }
                            },
                        ]
                    });
                    ctx.body = {
                        order: orderCreatedConfirmation,
                    }
                } catch (exception) {
                    if (exception instanceof ZodError) {
                        ctx.body = { issues: exception.issues };
                        ctx.status = 400;
                    }
                    console.log(exception);
                    throw exception;
                }
            }
        }
    },
    // now some webhooks
    "/webhook/order/created": {
        post: {
            handler: async (ctx: Koa.Context) => {
                ctx.body = {
                    message: "Order Created Webhook received",
                    payload: ctx.request.body
                }
            }
        }
    },
    "/webhook/order/pipeline/stage/changed": {
        post: {
            handler: async (ctx: Koa.Context) => {
                ctx.body = {
                    message: "Order Pipleline Stage Change Webhook received",
                    payload: ctx.request.body
                }
            }
        }
    }
};

// A list of bodyConvertedRoutes, which are used to convert the request body to the correct type
const bodyConvertedRoutes: ValidatingRequestRouting = {
    '/cart': {
        post: {
            schema: cartRequest,
            handler: handleCartRequest,
            args: { // CartHydraterArguments
                perVariant: () => {
                    return {
                        id: true
                    }
                }
            }
        }
    },
    '/register/email/magicklink': {
        post: {
            schema: magickLinkUserInfosRequest,
            handler: handleMagickLinkRegisterRequest,
            args: { // MagickLinkRegisterArguments
                mailer: createMailer(`${process.env.MAILER_DSN}`),
                jwtSecret: `${process.env.JWT_SECRET}`,
                confirmLinkPath: '/confirm/email/magicklink/:token',
                subject: "[Crystallize - Boilerplate] - Magic link login",
                from: "hello@crystallize.com",
                buildHtml: (request: MagickLinkUserInfosRequest, link: string) => mjml2html(
                    `<mjml>
                        <mj-body>
                        <mj-section>
                            <mj-column>
                            <mj-text>Hi there ${request.email}! Simply follow the link below to login.</mj-text>
                            <mj-button href="${link}" align="left">Click here to login</mj-button>
                            </mj-column>
                        </mj-section>
                        </mj-body>
                    </mjml>`
                ).html
            }
        }
    },
    "/confirm/email/magicklink/:token": {
        get: {
            schema: null,
            handler: handleMagickLinkConfirmationRequest,
            args: { // MagickLinkConfirmArguments
                jwtSecret: `${process.env.JWT_SECRET}`,
                backLinkPath: 'https://frontend.app.crystal/checkout?token=:token'
            }
        }
    },
    "/order/:id": {
        get: {
            schema: null,
            authenticated: true,
            handler: handleOrderConfirmationRequest
        }
    },
}

// Create the service api, you can destruct the router and/or app if needed.
const { run, router } = createServiceApiApp(bodyConvertedRoutes, routes, authenticatedMiddleware(`${process.env.JWT_SECRET}`));

// run the app!
run(process.env.PORT ? parseInt(process.env.PORT) : 3000);

// Create a reusable transporter object using the default SMTP transport
function createMailer(dsn: string) {
    const transporter = nodemailer.createTransport(dsn);
    transporter.verify((error, success) => {
        if (!success) {
            console.log(error);
        }
    });

    return (subject: string, to: string[] | string, from: string, html: string) => {
        return transporter.sendMail({
            from,
            to,
            subject,
            html
        });
    }
}
