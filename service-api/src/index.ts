import { createServiceApiApp, authenticatedMiddleware } from '@crystallize/node-service-api-router';
import { routes } from './routes/standard';
import { magickLinkBodyConvertedRoutes, magickLinkStandardRoutes } from './routes/magicklink';
import { orderBodyConvertedRoutes } from './routes/order';
import { cartBodyConvertedRoutes, cartStandardRoutes } from './routes/cart';
import { paymentBodyConvertedRoutes, paymentStandardRoutes } from './routes/payment';
import { webhookStandardRoutes } from './routes/webhook';
import Koa from 'koa';
import { getSuperFast } from './lib/superfast/SuperFast';

// Create the service api, you can destruct the router and/or app if needed.
const { run, app } = createServiceApiApp(
    {
        ...magickLinkBodyConvertedRoutes,
        ...orderBodyConvertedRoutes,
        ...cartBodyConvertedRoutes,
        ...paymentBodyConvertedRoutes
    },
    {
        ...routes,
        ...magickLinkStandardRoutes,
        ...cartStandardRoutes,
        ...paymentStandardRoutes,
        ...webhookStandardRoutes
    },
    authenticatedMiddleware(`${process.env.JWT_SECRET}`)
);

const superFastMiddleware: Koa.Middleware = async (ctx: Koa.Context, next: Koa.Next) => {
    const superFast = await getSuperFast(ctx.request.host);
    ctx.superFast = superFast;
    await next();
};

app.use(superFastMiddleware);

// run the app!
run(process.env.PORT ? parseInt(process.env.PORT) : 3000);
