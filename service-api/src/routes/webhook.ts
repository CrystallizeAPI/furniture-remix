import { StandardRouting } from '@crystallize/node-service-api-router';
import Koa from 'koa';

export const webhookStandardRoutes: StandardRouting = {
    '/webhook/order/created': {
        post: {
            handler: async (ctx: Koa.Context) => {
                ctx.response.body = {
                    message: 'Order Created Webhook received',
                    payload: ctx.request.body,
                };
            },
        },
    },
    '/webhook/order/pipeline/stage/changed': {
        post: {
            handler: async (ctx: Koa.Context) => {
                ctx.response.body = {
                    message: 'Order Pipleline Stage Change Webhook received',
                    payload: ctx.request.body,
                };
            },
        },
    },
};
