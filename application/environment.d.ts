declare global {
    namespace NodeJS {
        interface ProcessEnv {
            STORAGE_DSN: string;
            SUPERFAST_TENANT_IDENTIFIER: string;
            SUPERFAST_ACCESS_TOKEN_ID: string;
            SUPERFAST_ACCES_TOKEN_SECRET: string;
            SUPERFAST_HOST?: string;
            STOREFRONT_CONFIG_FILE?: string;
        }
    }
}

export {};
