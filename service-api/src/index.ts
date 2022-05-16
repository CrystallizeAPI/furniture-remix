import { createServiceApiApp, authenticatedMiddleware } from '@crystallize/node-service-api-router';
import { routes } from './routes/standard';
import { magickLinkBodyConvertedRoutes, magickLinkStandardRoutes } from './routes/magicklink';
import { orderBodyConvertedRoutes } from './routes/order';
import { cartBodyConvertedRoutes, cartStandardRoutes } from './routes/cart';
import { paymentBodyConvertedRoutes, paymentStandardRoutes } from './routes/payment';
import { webhookStandardRoutes } from './routes/webhook';

// Create the service api, you can destruct the router and/or app if needed.
const { run } = createServiceApiApp(
    {
        ...magickLinkBodyConvertedRoutes,
        ...orderBodyConvertedRoutes,
        ...cartBodyConvertedRoutes,
        ...paymentBodyConvertedRoutes,
    },
    {
        ...routes,
        ...magickLinkStandardRoutes,
        ...cartStandardRoutes,
        ...paymentStandardRoutes,
        ...webhookStandardRoutes,
    },
    authenticatedMiddleware(`${process.env.JWT_SECRET}`),
);

// run the app!
run(process.env.PORT ? parseInt(process.env.PORT) : 3000);
