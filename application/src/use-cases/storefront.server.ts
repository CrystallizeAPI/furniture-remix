import fs from 'fs';
import {
    createSuperFastAdapter,
    createStoreFront,
    createFilesystemAdapter,
    createMemoryAdapter,
    TStoreFrontConfig,
} from '@crystallize/js-storefrontaware-utils';
import { configureStorage } from './storage.server';
import {
    CrystalFakePaymentImplementation,
    PaymentImplementation,
    StoreFrontConfiguration,
} from './contracts/StoreFrontConfiguration';
import { getCurrencyFromCode } from './contracts/Currency';
import { TenantConfiguration } from './contracts/TenantConfiguration';
import { CreateClientOptions } from '@crystallize/js-api-client';

const storage = configureStorage(`${process.env?.STORAGE_DSN}`, {
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
                storefront: 'custom',
                logo: {
                    key: 'superfast-originated-logo',
                    url: process.env.STOREFRONT_STATIC_LOGO_URL ?? '',
                    variants: [],
                },
                enabled: true,
                id: 'inMemory',
                name: `custom`,
                paymentMethods: ['crystal', 'stripe', 'quickpay', 'klarna', 'razorpay', 'montonio', 'adyen', 'vipps'],
                taxIncluded: false,
                superfastVersion: '0.0.0',
                tenantId: `${process.env.CRYSTALLIZE_TENANT_ID}`,
                theme: `${process.env.STOREFRONT_THEME}`,
                configuration: {
                    CRYSTALLIZE_ACCESS_TOKEN_ID: `${process.env.CRYSTALLIZE_ACCESS_TOKEN_ID}`,
                    CRYSTALLIZE_ACCESS_TOKEN_SECRET: `${process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET}`,
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

    const createClientOptions: CreateClientOptions | undefined = process.env?.ENABLE_JS_API_CLIENT_PROFILING
        ? {
              profiling: {
                  onRequestResolved: ({ resolutionTimeMs, serverTimeMs }, query, variables) => {
                      const timings = `[JS-API-CLIENT]: Request processed in ${serverTimeMs}ms, resolved in ${resolutionTimeMs}ms.`;
                      if (process.env?.ENABLE_JS_API_CLIENT_PROFILING === 'verbose') {
                          console.log(timings, { query, variables });
                          return;
                      }
                      console.log(timings);
                  },
              },
          }
        : undefined;

    const [shared, secret] = await Promise.all([
        createStoreFront(adapter, false, createClientOptions),
        createStoreFront(adapter, true, createClientOptions),
    ]);
    return { shared, secret };
};

/**
 * For Client-side only, don't put any server-side secret here
 */
export const buildStoreFrontConfiguration = (
    locale: string,
    serviceApiUrl: string,
    storeFrontConfig: TStoreFrontConfig,
    tenantConfig: TenantConfiguration,
): StoreFrontConfiguration => {
    return {
        crystallize: {
            tenantIdentifier: process.env.CRYSTALLIZE_TENANT_IDENTIFIER ?? storeFrontConfig.tenantIdentifier,
            tenantId: process.env.CRYSTALLIZE_TENANT_ID ?? storeFrontConfig.tenantId,
        },
        language: locale.split('-')[0],
        locale: locale,
        theme: process.env.STOREFRONT_THEME ?? storeFrontConfig.theme,
        currency: process.env.STOREFRONT_CURRENCY
            ? getCurrencyFromCode(`${process.env.STOREFRONT_CURRENCY}`.toUpperCase())
            : tenantConfig.currency,
        logo: tenantConfig.logo ?? storeFrontConfig.logo,
        serviceApiUrl,
        crystalPayments: process.env?.CRYSTAL_PAYMENTS
            ? (process.env.CRYSTAL_PAYMENTS.split(',') as CrystalFakePaymentImplementation[])
            : ['coin', 'card'],
        paymentImplementations: process.env?.PAYMENT_IMPLEMENTATIONS
            ? (process.env.PAYMENT_IMPLEMENTATIONS.split(',') as PaymentImplementation[])
            : (storeFrontConfig.paymentMethods as PaymentImplementation[]),
        paymentImplementationVariables: {
            stripe: {
                PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY ?? storeFrontConfig.configuration.STRIPE_PUBLIC_KEY,
            },
            razorpay: {
                RAZORPAY_ID: process.env.RAZORPAY_ID ?? storeFrontConfig.configuration.RAZORPAY_ID,
            },
            adyen: {
                ENVIRONMENT: process.env.ADYEN_ENV ?? storeFrontConfig.configuration.ADYEN_ENV,
                MERCHANT_ACCOUNT:
                    process.env.ADYEN_MERCHANT_ACCOUNT ?? storeFrontConfig.configuration.ADYEN_MERCHANT_ACCOUNT,
                CLIENT_KEY: process.env.ADYEN_CLIENT_KEY ?? storeFrontConfig.configuration.ADYEN_CLIENT_KEY,
            },
            vipps: {
                ORIGIN: process.env.VIPPS_ORIGIN ?? storeFrontConfig.configuration.VIPPS_ORIGIN,
                CLIENT_ID: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig.configuration.VIPPS_CLIENT_ID,
            },
        },
    };
};
