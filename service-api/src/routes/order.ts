import {
    handleOrderRequestPayload,
    handleOrdersRequestPayload,
    OrderArguments,
    OrdersArguments,
} from '@crystallize/node-service-api-request-handlers';
import { ValidatingRequestRouting } from '@crystallize/node-service-api-router';
import Koa from 'koa';

export const orderBodyConvertedRoutes: ValidatingRequestRouting = {
    '/orders': {
        get: {
            schema: null,
            authenticated: true,
            handler: handleOrdersRequestPayload,
            args: (context: Koa.Context): OrdersArguments => {
                return {
                    user: context.user.aud,
                };
            },
        },
    },
    '/order/:id': {
        get: {
            schema: null,
            authenticated: true,
            handler: handleOrderRequestPayload,
            args: (context: Koa.Context): OrderArguments => {
                return {
                    user: context.user.aud,
                    orderId: context.params.id,
                };
            },
        },
    },
};
