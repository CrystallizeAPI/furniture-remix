import Koa from "koa";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MagickLinkUserInfos } from "../node-service-api-request-handlers/magicklink/types";

export function performancesLogger(): Koa.Middleware {
    return async (context: Koa.Context, next: Koa.Next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log(`${context.method} ${context.url} - ${ms}ms`);
        context.set('X-Response-Time', `${ms}`);
    };
}

export function authenticatedMiddleware(jwtSecret: string): Koa.Middleware {
    return async (context: Koa.Context, next: Koa.Next) => {
        const unauthorized = (code: number) => {
            context.status = 401;
            context.body = {
                message: "Unauthorized. Error code: " + code,
            }
        };
        const token = context.cookies.get('jwt');
        if (token === undefined) {
            unauthorized(1);
            return;
        }
        try {
            const decoded = jwt.verify(token, jwtSecret);
            if (decoded.sub === 'isLoggedInOnServiceApiToken') {
                context.user = (jwt.decode(token as string) as MagickLinkUserInfos & JwtPayload).aud;
            } else {
                unauthorized(3);
                return;
            }
        } catch (exception) {
            console.log(exception);
            unauthorized(2);
            return;
        }
        await next();
    }
}
