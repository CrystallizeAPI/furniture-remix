import { createRepository } from "@crystallize/node-service-api-request-handlers";
import { BackendStorage } from "@crystallize/node-service-api-request-handlers/dist/core/type";
import nodemailer from "nodemailer";
import * as redis from 'redis';

export function createMailer(dsn: string) {
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

function createRedisClient(): BackendStorage {
    const client = redis.createClient({
        url: `${process.env.REDIS_DSN || 'redis://127.0.0.1:6379'}`
    });
    client.connect();
    return {
        get: async (key: string) => await client.get(key),
        set: async (key: string, value: any) => {
            await client.set(key, value);
        }
    }
}

export const cartWrapperRepository = createRepository(createRedisClient());
