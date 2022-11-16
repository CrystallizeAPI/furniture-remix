import { BackendStorage as HandlerBackendStorage } from '@crystallize/node-service-api-request-handlers/dist/core/type';

export type StorageOptions = {
    prefix?: string;
};

export type BackendStorage = Pick<HandlerBackendStorage, 'get'> & {
    set: (key: string, value: any, ttl?: number) => Promise<void>;
};
