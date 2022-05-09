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
} from "@remix-run/react";
import { HttpCacheHeaderTagger } from "~/core/Http-Cache-Tagger";
import { useLocation } from "react-router-dom";
import {
  ErrorBoundaryComponent,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { CatchBoundaryComponent } from "@remix-run/react/routeModules";
import { fetchNavigation } from "~/core/UseCases";
import { Basket } from "~/core/components/basket";
import { Header } from "~/core/components/header";
import { Footer } from "./core/components/footer";

import tailwindStyles from "./styles/tailwind.css";

export function links() {
  return [{ rel: "stylesheet", href: tailwindStyles }];
}

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
      },
    },
    HttpCacheHeaderTagger("30s", "1w", ["shop"])
  );
};

const Document: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: any;
}) => (
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

const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: any;
}) => {
  const { navigation, ENV } = useLoaderData();
  const location = useLocation();
  return (
    <>
      <header className="lg:w-content w-full mx-auto p-8 sm:px-6">
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        ></script>
        {/* <Basket /> */}
        <Header navItem={navigation.tree.name} />
      </header>

      <div>
        <div>{children}</div>
      </div>
      <Footer />
    </>
  );
};

const App: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: any;
}) => (
  <Document>
    <Layout>
      <Outlet />
    </Layout>
  </Document>
);

export const ErrorBoundary: ErrorBoundaryComponent = ({
  error,
}: {
  error: any;
}) => {
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
