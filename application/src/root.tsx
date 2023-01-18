import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useCatch,
    useLoaderData,
    useLocation,
} from '@remix-run/react';
import {
    ErrorBoundaryComponent,
    HeadersFunction,
    json,
    LinksFunction,
    LoaderFunction,
    MetaFunction,
    redirect,
} from '@remix-run/node';
import { Header } from '~/ui/components/layout/header';
import { Footer } from '~/ui/components/layout/footer';
import tailwindDefaultTheme from '~/styles/tailwind.default.css';
import tailwindDarkTheme from '~/styles/tailwind.dark.css';
import tailwindRaibowTheme from '~/styles/tailwind.rainbow.css';
import React from 'react';
import { buildStoreFrontConfiguration, getStoreFront } from '~/use-cases/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { AppContextProvider, useAppContext } from '~/ui/app-context/provider';
import { CrystallizeProvider } from '@crystallize/reactjs-hooks';
import { StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { FAVICON_VARIANTS } from './routes/$langstore/favicon/$size[.png]';
import { CatchBoundaryComponent } from '@remix-run/react/dist/routeModules';
import { StoreFrontConfiguration } from '~/use-cases/contracts/StoreFrontConfiguration';
import {
    availableLanguages,
    buildLanguageMarketAwareLink,
    displayableLanguages,
    isValidLanguageMarket,
} from '~/use-cases/LanguageAndMarket';
import { storage, memoryStorage } from '~/use-cases/services.server';
import fetchTranslations from '~/use-cases/fetchTranslations.server';
import { Tree } from '~/use-cases/contracts/Tree';
import { Footer as FooterType } from '~/use-cases/contracts/Footer';
import { ErrorComponent } from '~/ui/components/error';

export const meta: MetaFunction = () => {
    return {
        charset: 'utf-8',
        title: `Crystallize - Superfast`,
        viewport: 'width=device-width,initial-scale=1',
    };
};

export const links: LinksFunction = () => {
    return [
        {
            rel: 'stylesheet',
            href: tailwindDefaultTheme,
        },
    ];
};

function getTailwindThemeForConfig(theme: string) {
    switch (theme) {
        case 'dark':
            return tailwindDarkTheme;
        case 'rainbow':
            return tailwindRaibowTheme;
        default:
            return tailwindDefaultTheme;
    }
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return {
        Link: `<${getTailwindThemeForConfig(
            loaderHeaders.get('X-SuperFast-Theme') as string,
        )}>; rel=preload; as=style; crossorigin=anonymous`,
    };
};

export let loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    if (!isValidLanguageMarket(requestContext.language, requestContext.market)) {
        return redirect('/' + availableLanguages[0] + requestContext.url.pathname, 301);
    }
    const { shared, secret } = await getStoreFront(requestContext.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
    });
    const [navigation, tenantConfig, translations, footer] = await Promise.all([
        api.fetchNavigation('/'),
        api.fetchTenantConfig(secret.config.tenantIdentifier),
        fetchTranslations(storage, memoryStorage, requestContext.language),
        api.fetchFooter('/footer'),
    ]);

    const apiPath = buildLanguageMarketAwareLink('/api', requestContext.language, requestContext.market);
    const frontConfiguration = buildStoreFrontConfiguration(
        requestContext.locale,
        //TESTMODE trick: here we use the real host, not the getContext that check SUPERFAST
        `http${requestContext.isSecure ? 's' : ''}://${request.headers.get('Host')!}${apiPath}`,
        shared.config,
        tenantConfig,
    );
    return json(
        {
            isHTTPS: requestContext.isSecure,
            host: requestContext.host,
            frontConfiguration,
            navigation,
            baseUrl: requestContext.baseUrl,
            translations,
            footer,
        },
        {
            headers: {
                ...StoreFrontAwaretHttpCacheHeaderTagger('30s', '30s', ['shop'], shared.config.tenantIdentifier)
                    .headers,
                'X-SuperFast-Theme': shared.config.theme,
            },
        },
    );
};

type LoaderData = {
    frontConfiguration: StoreFrontConfiguration;
    navigation: {
        folders: Tree[];
        topics: Tree[];
    };
    isHTTPS: boolean;
    host: string;
    translations: any;
    baseUrl: string;
    footer: FooterType;
};

const Document: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isHTTPS, frontConfiguration, translations, baseUrl } = useLoaderData<LoaderData>();
    let location = useLocation();
    const path = '/' + location.pathname.split('/').slice(2).join('/');

    if (typeof window !== 'undefined') {
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('/sw.js').then(
                function (registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                },
                function (err) {
                    console.log('ServiceWorker registration failed: ', err);
                },
            );
        });
    }

    return (
        <CrystallizeProvider
            language={frontConfiguration.language}
            tenantIdentifier={frontConfiguration.crystallize.tenantIdentifier}
        >
            <AppContextProvider initialState={frontConfiguration} translations={translations}>
                <html lang={frontConfiguration.language}>
                    <head>
                        <meta charSet="utf-8" />
                        <meta name="viewport" content="width=device-width,initial-scale=1" />
                        <meta name="apple-mobile-web-app-capable" content="yes" />
                        <meta name="mobile-web-app-capable" content="yes" />
                        <Favicons />
                        <link rel="manifest" href="/manifest.json" />
                        <meta name="msapplication-TileColor" content="#da532c" />
                        <meta name="theme-color" content="#ffffff" />
                        <link href={`${baseUrl}${location?.pathname}`} rel="canonical" />
                        <Meta />
                        <Links />
                        {displayableLanguages.map((lang) => (
                            <link
                                key={lang.code}
                                rel="alternate"
                                hrefLang={lang.code}
                                href={`${baseUrl}${buildLanguageMarketAwareLink(path, lang.code)}`}
                            />
                        ))}
                        <script suppressHydrationWarning={true} type="text/css">
                            {
                                '*,:after,:before{box-sizing:border-box;border:0 solid}:after,:before{--tw-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}body{margin:0;line-height:inherit}h2{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}figure,h2,p{margin:0}img,svg{display:block;vertical-align:middle}img{max-width:100%;height:auto}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-date-and-time-value{min-height:1.5em}*,:after,:before{--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:#3b82f680;--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.container{width:100%}@media (max-width:1024px){#grid-item{grid-column:span 3!important}}.absolute{position:absolute}.relative{position:relative}.-right-2{right:-.5rem}.-top-2{top:-.5rem}.z-10{z-index:10}.mx-auto{margin-left:auto;margin-right:auto}.mt-4{margin-top:1rem}.flex{display:flex}.h-80{height:20rem}.h-full{height:100%}.h-5{height:1.25rem}.w-full{width:100%}.w-60{width:15rem}.w-5{width:1.25rem}.flex-col{flex-direction:column}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-evenly{justify-content:space-evenly}.gap-5{gap:1.25rem}.gap-1{gap:.25rem}.self-end{align-self:flex-end}.overflow-hidden{overflow:hidden}.rounded-xl{border-radius:.75rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:1000px}.rounded-r-xl{border-top-right-radius:.75rem;border-bottom-right-radius:.75rem}.bg-primary{--tw-bg-opacity:1;background-color:rgb(255 247 240/var(--tw-bg-opacity))}.bg-background1{--tw-bg-opacity:1;background-color:rgb(240 239 235/var(--tw-bg-opacity))}.bg-grey{background-color:#00000008}.bg-text{--tw-bg-opacity:1;background-color:rgb(55 53 103/var(--tw-bg-opacity))}.p-8{padding:2rem}.p-5{padding:1.25rem}.px-5{padding-left:1.25rem;padding-right:1.25rem}.px-2{padding-left:.5rem;padding-right:.5rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-7{padding-top:1.75rem;padding-bottom:1.75rem}.py-20{padding-top:5rem;padding-bottom:5rem}.text-center{text-align:center}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-sm{font-size:.875rem;line-height:1.25rem}.font-bold{font-weight:700}.text-primary{--tw-text-opacity:1;color:rgb(255 247 240/var(--tw-text-opacity))}'
                            }
                        </script>
                        <script defer src="https://pim.crystallize.com/static/frontend-preview-listener.js" />
                        <link rel="stylesheet" href={getTailwindThemeForConfig(frontConfiguration.theme)} />
                    </head>
                    <body data-theme={frontConfiguration.theme}>
                        {children}
                        <ScrollRestoration />
                        <Scripts />
                        <LiveReload port={isHTTPS ? 443 : undefined} />
                    </body>
                </html>
            </AppContextProvider>
        </CrystallizeProvider>
    );
};

const Favicons: React.FC = () => {
    const { path } = useAppContext();
    const linkTags = Object.entries(FAVICON_VARIANTS).map(([variant, meta]) => {
        const extra = meta.extra ?? {};
        return (
            <link
                key={`/favicon/${variant}.png`}
                rel={meta.rel}
                sizes={`${meta.size}x${meta.size}`}
                href={path(`/favicon/${variant}.png`)}
                {...extra}
            />
        );
    });

    return <>{linkTags}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { navigation, footer } = useLoaderData<LoaderData>();

    return (
        <>
            <Header navigation={navigation} />
            <div>{children}</div>
            <Footer footer={footer} />
        </>
    );
};

export default () => {
    return (
        <Document>
            <Layout>
                <Outlet />
            </Layout>
        </Document>
    );
};

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
                <ErrorComponent text={error.message} code={500} />
                {/* add the UI you want your users to see */}
                <Scripts />
            </body>
        </html>
    );
};

export const CatchBoundary: CatchBoundaryComponent = () => {
    const caught = useCatch();
    if (caught.data !== null) {
        return (
            <Document>
                <Layout>
                    <ErrorComponent text={caught.statusText} code={caught.status} />
                </Layout>
            </Document>
        );
    }

    return (
        <html>
            <head>
                <title>Oh no!</title>
                <Meta />
                <Links />
            </head>
            <body>
                <ErrorComponent />
                <Scripts />
            </body>
        </html>
    );
};
