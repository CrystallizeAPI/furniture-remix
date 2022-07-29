import { createRepository } from '@crystallize/node-service-api-request-handlers';
import { BackendStorage } from '@crystallize/node-service-api-request-handlers/dist/core/type';
import nodemailer from 'nodemailer';
import * as redis from 'redis';

const storage = process.env?.STORAGE === 'memory' ? createMemoryClient() : createRedisClient();
export const cartWrapperRepository = createRepository(storage);

export function createMailer(dsn: string) {
    if (dsn.startsWith('sendgrid://')) {
        const sgMail = require('@sendgrid/mail');
        const key = dsn.split('://')[1];
        sgMail.setApiKey(key);

        return (subject: string, to: string[] | string, from: string, html: string) => {
            return sgMail.send({
                from,
                to,
                subject,
                html,
            });
        };
    }

    let realDSN = dsn;
    const config = require('platformsh-config').config();
    if (config.isValidPlatform()) {
        realDSN = `smtp://${process.env.PLATFORM_SMTP_HOST}:25/?pool=true`;
    }
    const transporter = nodemailer.createTransport(realDSN);
    transporter.verify((error, success) => {
        if (!success) {
            console.log(`DSN ${realDSN}: ${error}`);
        }
    });

    return (subject: string, to: string[] | string, from: string, html: string) => {
        return transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
    };
}

function createRedisClient(): BackendStorage {
    let redisDSN = `${process.env.REDIS_DSN || 'redis://127.0.0.1:6379'}`;
    const config = require('platformsh-config').config();
    if (config.isValidPlatform()) {
        const credentials = config.credentials('redis');
        redisDSN = `redis://${credentials.host}:${credentials.port}`;
    }
    const client = redis.createClient({ url: redisDSN });
    client.connect();
    return {
        get: async (key: string) => await client.get(key),
        set: async (key: string, value: any) => {
            await client.set(key, value);
        },
    };
}

function createMemoryClient(): BackendStorage {
    const store = new Map();
    return {
        get: async (key: string) => store.get(`superfast-${key}`),
        set: async (key: string, value: any) => {
            store.set(`superfast-${key}`, value);
        },
    };
}
