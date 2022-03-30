import Koa from "koa";
import Router from "koa-router";
import json from "koa-json";
import cors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { performancesLogger, authenticatedMiddleware } from "./middlewares";
import { ValidatingRequestRouting, StandardRouting, ValidatingRoute, StandardRoute } from "./types";
import compose from 'koa-compose';
import { z, ZodError } from "zod";
import { HttpMethod, httpMethods } from "./types";

export function createServiceApiApp(
    validatedRoutes: ValidatingRequestRouting,
    standardRoutes: StandardRouting,
    authenticatedMiddleware: Koa.Middleware
): { run: (port: number) => void, router: Router, app: Koa } {
    const app = new Koa();
    const router = new Router();
    app.use(performancesLogger());
    app.use(cors());
    app.use(json({ pretty: false }));
    app.use(bodyParser());
    [
        {
            routes: validatedRoutes,
            middlewareManagement: (routeInfo: unknown, method: HttpMethod, path: string) => {
                const route = routeInfo as ValidatingRoute<any, any>;
                const defaultMiddleware = async (ctx: Koa.Context, next: Koa.Next): Promise<void> => {
                    try {
                        const request = validateRequest(route.schema, ctx.request.body);
                        const response = await route.handler(request, ctx, route.args);
                        ctx.body = response;

                    } catch (exception: any | ZodError) {
                        if (exception instanceof ZodError) {
                            ctx.body = { issues: exception.issues };
                            ctx.status = 400;
                        }
                        ctx.response.body = exception;
                        ctx.response.status = exception.code || 500;
                        ctx.response.message = exception.status;
                        console.log(exception);
                    }
                    next();
                };
                if (route.authenticated) {
                    router[method](path, compose([authenticatedMiddleware, defaultMiddleware]));
                } else {
                    router[method](path, defaultMiddleware);
                }
            }
        },
        {
            routes: standardRoutes,
            middlewareManagement: (routeInfo: unknown, method: HttpMethod, path: string) => {
                const route = routeInfo as StandardRoute;
                const defaultMiddleware = (ctx: Koa.Context, next: Koa.Next): void => {
                    try {
                        route.handler(ctx);
                    } catch (exception: any) {
                        ctx.response.body = exception;
                        ctx.response.status = exception.code || 500;
                        ctx.response.message = exception.status;
                    }
                    next();
                };
                if (route.authenticated) {
                    router[method](path, compose([authenticatedMiddleware, defaultMiddleware]));
                } else {
                    router[method](path, defaultMiddleware);
                }
            }
        }
    ].forEach(({ routes, middlewareManagement }) => {
        Object.keys(routes).forEach((path: string) => {
            Object.keys(routes[path]).forEach((sMethod: string) => {
                const method = toHttpMethod(sMethod);
                if (routes[path] && routes[path][method] !== undefined) {
                    const route = routes[path];
                    const routeInfo = route[method];
                    if (routeInfo !== undefined) {
                        middlewareManagement(routeInfo, method, path);
                    }
                }
            });
        });
    });

    return {
        app,
        router,
        run: (port: number) => {
            app.use(router.routes()).use(router.allowedMethods());
            app.listen(port, () => {
                console.log(`Service API - Started: http://localhost:${port}`);
            });
        }
    };
}


function isHttpMethod(method: string): method is HttpMethod {
    return httpMethods.includes(method as any);
}

function toHttpMethod(method: string): HttpMethod {
    const normalizedMethod = method.toLowerCase();
    if (isHttpMethod(normalizedMethod)) {
        return normalizedMethod;
    }
    throw new Error(`Unknown HTTP method ${method}`);
}

function validateRequest<T>(schema: z.ZodType<T, z.ZodTypeDef, T> | null, request: unknown): T {
    if (schema === null) {
        return request as T;
    }
    return schema.parse(request);
}
