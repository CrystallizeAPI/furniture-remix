import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useCatch,
    useLoaderData,
    Link,
    useLocation
} from '@remix-run/react';
import { HttpCacheHeaderTagger } from "~/core/Http-Cache-Tagger";
import { ErrorBoundaryComponent, json, LoaderFunction, MetaFunction } from '@remix-run/node';

import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { fetchNavigation } from "~/core/UseCases";
import { Basket } from "~/core/components/Cart";
import React from 'react';

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "Crystallize Furniture v2 Remix Boilerplate",
    viewport: "width=device-width,initial-scale=1",
});


export let loader: LoaderFunction = async () => {
    return json(
        {
            navigation: await fetchNavigation(),
            ENV: {
                SERVICE_API_URL: process.env.SERVICE_API_URL,
                STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
            }
        }
        , HttpCacheHeaderTagger('30s', '1w', ['shop'])
    );
};

const Document: React.FC<{ children: React.ReactNode }> = ({ children }) => (
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
    const { navigation, ENV } = useLoaderData();
    const location = useLocation();
    return (<>
        <header>
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.ENV = ${JSON.stringify(ENV)}`,
                }}
            ></script>
            <Basket />
            <p>Nav: {navigation.tree.name}</p>
            <ul>
                {navigation.tree.children.map((child: any) => {
                    return <li key={child.path}>
                        <Link to={child.path}>{child.name}</Link> {location.pathname.substring(0, child.path.length) === child.path && ' - active'}
                    </li>
                })}
            </ul>
        </header>
        <hr />
        <div>
            <div>{children}</div>
        </div>
        <hr style={{ clear: 'both' }} />
        <footer>&lt;/&gt; with &lt;3 by Crystallize</footer>
    </>
    );
}

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Document>
        <Layout>
            <Outlet />
        </Layout>
    </Document>
)

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
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
}

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
