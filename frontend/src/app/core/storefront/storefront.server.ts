import fs from 'fs';
import * as redis from 'redis';
import {
    createSuperFastAdapter,
    createStoreFront,
    createFilesystemAdapter,
} from '@crystallize/js-storefrontaware-utils';

function createStorage() {
    let redisDSN = `${process.env.REDIS_DSN || 'redis://127.0.0.1:6379'}`;
    const config = require('platformsh-config').config();
    if (config.isValidPlatform()) {
        const credentials = config.credentials('redis');
        redisDSN = `redis://${credentials.host}:${credentials.port}`;
    }
    const client = redis.createClient({ url: redisDSN });
    client.connect();
    return {
        get: async (key: string) => await client.get(`superfast-${key}`),
        set: async (key: string, value: any, ttl: number) => {
            await client.set(`superfast-${key}`, value);
            client.expireAt(`superfast-${key}`, Math.floor(Date.now() / 1000) + ttl);
        },
    };
}

const storage = createStorage();

export const getStoreFront = async (hostname: string) => {
    const adapter = (() => {
        if (process.env?.STOREFRONT_CONFIG_FILE) {
            try {
                if (fs.existsSync(process.env.STOREFRONT_CONFIG_FILE)) {
                    return createFilesystemAdapter(process.env.STOREFRONT_CONFIG_FILE);
                }
            } catch (err) {
                // nothing to do let it go and fallback to the default
            }
        }

        return createSuperFastAdapter(
            hostname,
            {
                tenantIdentifier: `${process.env.SUPERFAST_TENANT_IDENTIFIER}`,
                accessTokenId: `${process.env.SUPERFAST_ACCESS_TOKEN_ID}`,
                accessTokenSecret: `${process.env.SUPERFAST_ACCESS_TOKEN_SECRET}`,
            },
            storage,
            30,
        );
    })();

    const [shared, secret] = await Promise.all([createStoreFront(adapter, false), createStoreFront(adapter, true)]);
    return { shared, secret };
};
