import { handleCartRequest } from './lib/node-service-api-request-handlers/cart/handlers';
import { Cart, cartRequest } from './lib/node-service-api-request-handlers/cart/types';
import { createServiceApiApp } from './lib/node-service-api-router/app';
import { ValidatingRequestRouting, StandardRouting } from './lib/node-service-api-router/types';
import Koa from 'koa';
import { MagickLinkUserInfosRequest, magickLinkUserInfosRequest } from './lib/node-service-api-request-handlers/magicklink/types';
import { handleMagickLinkConfirmationRequest, handleMagickLinkRegisterRequest } from './lib/node-service-api-request-handlers/magicklink/handlers';
import mjml2html from 'mjml';
import { authenticatedMiddleware } from './lib/node-service-api-router/middlewares';
import nodemailer from "nodemailer";
import { handleOrderConfirmationRequest } from './lib/node-service-api-request-handlers/order/handlers';

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

// A list of more standard routes
// it could also be used to extends the bodyConvertedRoutes response body
const routes: StandardRouting = {
    '/': {
        get: {
            handler: (ctx: Koa.Context) => {
                ctx.body = { msg: `Crystallize Service API - Tenant ${process.env.CRYSTALLIZE_TENANT_IDENTIFIER}` };
            }
        },
    },
    '/echo': {
        post: {
            handler: (ctx: Koa.Context) => {
                ctx.body = {
                    echoed: ctx.request.body
                }
            }
        }
    },
    '/authenticated/echo': {
        post: {
            authenticated: true,
            handler: (ctx: Koa.Context) => {
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
            handler: (ctx: Koa.Context) => {
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
            handler: (ctx: Koa.Context) => {
                const cart = ctx.body as Cart;
                ctx.body = {
                    ...cart,
                    hello: "world"
                }
            }
        }
    },
    // now some webhooks
    "/webhook/order/created": {
        post: {
            handler: (ctx: Koa.Context) => {
                ctx.body = {
                    message: "Order Created Webhook received",
                    payload: ctx.request.body
                }
            }
        }
    },
    "/webhook/order/pipeline/stage/changed": {
        post: {
            handler: (ctx: Koa.Context) => {
                ctx.body = {
                    message: "Order Pipleline Stage Change Webhook received",
                    payload: ctx.request.body
                }
            }
        }
    }
};

// Create the service api, you can destruct the router and/or app if needed.
const { run, router } = createServiceApiApp(bodyConvertedRoutes, routes, authenticatedMiddleware(`${process.env.JWT_SECRET}`));

// run the app!
run(process.env.PORT ? parseInt(process.env.PORT) : 3000);

