declare global {
    namespace NodeJS {
        interface ProcessEnv {
            SUPERFAST_HOST?: string;
            REDIS_DSN?: string;
            STOREFRONT_CONFIG_FILE?: string;
            SUPERFAST_TENANT_IDENTIFIER: string;
            SUPERFAST_ACCESS_TOKEN_ID: string;
            SUPERFAST_ACCES_TOKEN_SECRET: string;
        }
    }
}

export {};
