declare global {
    namespace NodeJS {
        interface ProcessEnv {
            STORAGE_DSN?: string;
            SUPERFAST_TENANT_IDENTIFIER?: string;
            SUPERFAST_ACCESS_TOKEN_ID?: string;
            SUPERFAST_ACCES_TOKEN_SECRET?: string;
            SUPERFAST_HOST?: string;
            STOREFRONT_IDENTIFIER?: string;
            STOREFRONT_LANGUAGE?: string;
            STOREFRONT_STATIC_LOGO_URL?: string;
            STOREFRONT_THEME?: string;
            CRYSTALLIZE_TENANT_IDENTIFIER?: string;
            CRYSTALLIZE_ACCESS_TOKEN_ID?: string;
            CRYSTALLIZE_ACCESS_TOKEN_SECRET?: string;
        }
    }
}

export {};
