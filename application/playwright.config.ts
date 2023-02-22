import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

process.env.STORAGE_DSN = 'memory://';
process.env.SUPERFAST_HOST = 'furniture.superfast.local';
process.env.STOREFRONT_IDENTIFIER = 'furniture';
process.env.STOREFRONT_LANGUAGE = 'en';
process.env.STOREFRONT_THEME = 'default';

/**
 * NOTE YOU WANT TO CHANGE THAT TO YOUR OWN TENANT IDENTIFIER AND CREDENTIALS from the ENVIRONMENT VARIABLES
 */
process.env.CRYSTALLIZE_TENANT_IDENTIFIER = process.env.PLAYWRIGHT_TENANT_IDENTIFIER ?? 'frntr-blueprint';
process.env.CRYSTALLIZE_ACCESS_TOKEN_ID = process.env.PLAYWRIGHT_ACCESS_TOKEN_ID ?? '';
process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET = process.env.PLAYWRIGHT_ACCESS_TOKEN_SECRET ?? '';
/**  */

process.env.CRYSTAL_PAYMENTS = 'coin,card';
process.env.HTTP_CACHE_SERVICE = 'varnish';
process.env.JWT_SECRET = 'xXx';

const config: PlaywrightTestConfig = {
    testDir: './tests',
    timeout: 60 * 1000,
    expect: {
        timeout: 5000,
    },
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    use: {
        actionTimeout: 0,
        baseURL: 'http://localhost:3000/en',
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
            },
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge',
        //   },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ],
    // outputDir: 'test-results/',
    webServer: {
        command: 'npm run build && npm run start',
        port: 3000,
    },
};

export default config;
