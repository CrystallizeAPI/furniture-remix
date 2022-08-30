import fs from 'fs';
import {
    createSuperFastAdapter,
    createStoreFront,
    createFilesystemAdapter,
    createMemoryAdapter,
} from '@crystallize/js-storefrontaware-utils';
import { configureStorage } from './storage.server';

const storage = configureStorage(process.env?.STORAGE_DSN, {
    prefix: 'superfast-',
});

export const getStoreFront = async (hostname: string) => {
    const adapter = (() => {
        // if there is a file for the StoreFront, use that, note that it's safer to use the MemoryAdapter
        if (process.env?.STOREFRONT_CONFIG_FILE) {
            try {
                if (fs.existsSync(process.env.STOREFRONT_CONFIG_FILE)) {
                    return createFilesystemAdapter(process.env.STOREFRONT_CONFIG_FILE);
                }
            } catch (err) {
                // nothing to do let it go and fallback to the default
            }
        }

        // Default scenario: use the MemoryAdapter
        if (!process.env?.SUPERFAST_ACCESS_TOKEN_SECRET) {
            return createMemoryAdapter({
                identifier: `${process.env.STOREFRONT_IDENTIFIER}`,
                tenantIdentifier: `${process.env.CRYSTALLIZE_TENANT_IDENTIFIER}`,
                language: `${process.env.STOREFRONT_LANGUAGE}`,
                storefront: '',
                logo: `${process.env.STOREFRONT_STATIC_LOGO_URL}`,
                theme: `${process.env.STOREFRONT_THEME}`,
                configuration: {
                    ACCESS_TOKEN_ID: `${process.env.CRYSTALLIZE_ACCESS_TOKEN_ID}`,
                    ACCESS_TOKEN_SECRET: `${process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET}`,
                    // @TODO: ADD DEFAULT HERE
                },
            });
        }

        // Superfast fallback scenario: use the Superfast Registry to get the config
        return createSuperFastAdapter(
            hostname,
            {
                tenantIdentifier: `${process.env.SUPERFAST_TENANT_IDENTIFIER}`,
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
