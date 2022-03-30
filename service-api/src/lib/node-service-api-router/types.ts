import { z } from "zod";
import Koa from 'koa';

export const httpMethods = ["get", "post", "put", "patch", "delete"] as const;
export type HttpMethod = typeof httpMethods[number];

export interface ValidatingRoute<S, T> {
    schema: z.ZodType<S, z.ZodTypeDef, S> | null;
    handler: (request: any, context: Koa.Context, args?: any) => Promise<T>;
    args?: any;
    authenticated?: boolean;
};

export interface StandardRoute {
    handler: (ctx: Koa.Context) => void;
    authenticated?: boolean;
};


export interface ValidatingRequestRouting<S extends object = {}, T extends object = {}> {
    [path: string]: {
        [method in HttpMethod]?: ValidatingRoute<S, T>;
    }
};

export interface StandardRouting {
    [path: string]: {
        [method in HttpMethod]?: StandardRoute
    }
};
