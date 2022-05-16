import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration, useCatch, useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { ErrorBoundaryComponent, HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';

import { CatchBoundaryComponent } from '@remix-run/react/routeModules';
import { fetchNavigation } from '~/core/UseCases';
import { Cart } from '~/core/components/cart';
import { Header } from '~/core/components/header';
import { Footer } from './core/components/footer';
import tailwindStyles from './styles/tailwind.css';
import React from 'react';
import { getSuperFast, SuperFastConfig } from 'src/lib/superfast/SuperFast';
import { SuperFastProvider } from 'src/lib/superfast/SuperFastProvider/Provider';

export function links() {
    return [{ rel: 'stylesheet', href: tailwindStyles }];
}

export const meta: MetaFunction = ({ parentsData }) => {
    return {
        charset: 'utf-8',
        title: `Crystallize - Superfast`,
        viewport: 'width=device-width,initial-scale=1',
    };
};

export const headers: HeadersFunction = () => {
    return {
        Link: `<${tailwindStyles}>; rel=preload; as=style`,
    };
};

export let loader: LoaderFunction = async ({ request }) => {
    const config = require('platformsh-config').config();
    const superFast = await getSuperFast(request.headers.get('Host')!);
    return json(
        {
            superFastConfig: superFast.config,
            navigation: await fetchNavigation(superFast.apiClient),
            ENV: {
                CRYSTALLIZE_TENANT_IDENTIFIER: superFast.config.tenantIdentifier,
                SERVICE_API_URL: config.isValidPlatform()
                    ? config.getRoute('serviceapi').url.replace(/\/$/, '').replace('*', superFast.config.identifier)
                    : (process.env.SERVICE_API_URL_PATTERN || '').replace('%s', superFast.config.identifier),
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
            },
        },
        HttpCacheHeaderTagger('30s', '1w', ['shop']),
    );
};

const Document: React.FC<{ children: React.ReactNode }> = ({ children }: { children: any }) => (
    <html lang="en">
        <head>
            <Meta />
            <Links />
        </head>
        <body>
            {children}
            <ScrollRestoration />
            <Scripts />
            <LiveReload port={443} />
        </body>
    </html>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { superFastConfig, navigation, ENV } = useLoaderData<{
        ENV: any;
        navigation: any;
        superFastConfig: SuperFastConfig;
    }>();
    return (
        <SuperFastProvider config={superFastConfig}>
            <header className="lg:w-content w-full mx-auto p-8 sm:px-6">
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.ENV = ${JSON.stringify(ENV)}`,
                    }}
                ></script>
                <Cart />
                <Header navigation={navigation} />
            </header>
            <div style={{ backgroundColor: superFastConfig.theme === 'dark' ? '#000' : 'transparent' }}>
                <div>{children}</div>
            </div>
            <Footer />
        </SuperFastProvider>
    );
};

const App: React.FC<{ children: React.ReactNode }> = ({ children }: { children: any }) => (
    <Document>
        <Layout>
            <Outlet />
        </Layout>
    </Document>
);

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }: { error: any }) => {
    console.error(error);
    return (
        <html>
            <head>
                <title>Oh no!</title>
                <Meta />
                <Links />
            </head>
            <body>
                {error.message}
                {/* add the UI you want your users to see */}
                <Scripts />
            </body>
        </html>
    );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
    const caught = useCatch();
    return (
        <html>
            <head>
                <title>Oops!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <h1>
                    {caught.status} {caught.statusText}
                </h1>
                <Scripts />
            </body>
        </html>
    );
};

export default App;
