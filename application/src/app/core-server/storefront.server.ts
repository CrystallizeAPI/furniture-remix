import fs from 'fs';
import {
    createSuperFastAdapter,
    createStoreFront,
    createFilesystemAdapter,
} from '@crystallize/js-storefrontaware-utils';
import { configureStorage } from './storage.server';

const storage = configureStorage(process.env?.STORAGE_DSN, {
    prefix: 'superfast-',
});

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
                tenantIdentifier: process.env.SUPERFAST_TENANT_IDENTIFIER,
                accessTokenId: process.env.SUPERFAST_ACCESS_TOKEN_ID,
                accessTokenSecret: process.env.SUPERFAST_ACCESS_TOKEN_SECRET,
            },
            storage,
            600,
        );
    })();

    const [shared, secret] = await Promise.all([createStoreFront(adapter, false), createStoreFront(adapter, true)]);
    return { shared, secret };
};
