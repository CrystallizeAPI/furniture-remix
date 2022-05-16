import { StandardRouting } from "@crystallize/node-service-api-router";
import Koa from 'koa';

export const routes: StandardRouting = {
    '/': {
        get: {
            handler: async (ctx: Koa.Context) => {
                ctx.response.body = { msg: `Crystallize Service API - Tenant ${ctx.superFast.tenantIdentifier}` };
            }
        },
    },
    '/echo': {
        post: {
            handler: async (ctx: Koa.Context) => {
                ctx.response.body = {
                    echoed: ctx.request.body
                }
            }
        }
    },
    '/authenticated/echo': {
        post: {
            authenticated: true,
            handler: async (ctx: Koa.Context) => {
                ctx.response.body = {
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
                ctx.response.body = {
                    message: "Logged out"
                }
            }
        }
    }
};

