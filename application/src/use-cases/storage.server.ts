import * as redis from 'redis';
import { BackendStorage, StorageOptions } from './contracts/BackendStorage';

function createRedisStorageEngine(dsn: string | undefined, options: StorageOptions = {}): BackendStorage {
    const prefix = options?.prefix ?? '';
    let redisDSN = `${dsn || 'redis://127.0.0.1:6379'}`;
    const config = require('platformsh-config').config();
    if (config.isValidPlatform()) {
        const credentials = config.credentials('redis');
        redisDSN = `redis://${credentials.host}:${credentials.port}`;
    }
    const client = redis.createClient({ url: redisDSN });
    client.connect();
    return {
        get: async (key: string) => await client.get(`${prefix}${key}`),
        set: async (key: string, value: any, ttl?: number | undefined) => {
            await client.set(`${prefix}${key}`, value);
            if (ttl) {
                client.expireAt(`${prefix}${key}`, Math.floor(Date.now() / 1000) + ttl);
            }
        },
    };
}

function createMemoryStorageEngine(options: StorageOptions = {}): BackendStorage {
    const prefix = options?.prefix ?? '';
    const store = new Map();
    return {
        get: async (key: string) => {
            const hit = store.get(`${prefix}${key}`);
            if (!hit) return undefined;
            const { value, ttl } = hit;
            return !ttl || ttl > Date.now() / 1000 ? value : undefined;
        },
        set: async (key: string, value: any, ttl?: number) => {
            store.set(`${prefix}${key}`, {
                value,
                ttl: ttl && Math.floor(Date.now() / 1000) + ttl,
            });
        },
    };
}

/**
 * Configure a storage adapter based on the provided dsn
 * dsn=redis://host:port will create a redis storage engine
 * dsn=memory:// will create an in-memory storage engine
 *
 * @param dsn Connection string
 * @param options Object with options: prefix
 */
export function configureStorage(dsn: string, options: StorageOptions = {}): BackendStorage {
    if (dsn?.startsWith?.('redis://')) {
        return createRedisStorageEngine(dsn, options);
    }
    if (!global.__gStorage) global.__gStorage = {};
    if (!global.__gStorage[dsn]) {
        global.__gStorage[dsn] = createMemoryStorageEngine(options);
    }
    return global.__gStorage[dsn];
}

declare global {
    var __gStorage: Record<string, BackendStorage>;
}
