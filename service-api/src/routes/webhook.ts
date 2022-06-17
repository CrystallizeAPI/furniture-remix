import { StandardRouting } from '@crystallize/node-service-api-router';
import Koa from 'koa';
import fetch from 'node-fetch';

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
    '/webhook/cache/purge': {
        post: {
            handler: async (ctx: Koa.Context) => {
                const payload = ctx.request.body;
                // we keep it simple for now and we purge all cache for the tenant identifier
                const keys = [ctx.storeFront.config.tenantIdentifier];
                const response = await fetch(`https://api.fastly.com/service/${process.env.FASTLY_SERVICE_ID}/purge`, {
                    method: 'POST',
                    headers: {
                        'fastly-soft-purge': `1`,
                        'Fastly-Key': `${process.env.FASTLY_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'surrogate-key': keys.join(' '),
                    },
                });
                const keyPurged = await response.json();
                ctx.response.body = {
                    message: `${Object.keys(keyPurged).length} key(s) soft purged.`,
                    keys: keyPurged,
                };
            },
        },
    },
};
