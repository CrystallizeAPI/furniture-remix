import { PassThrough } from 'stream';
import type { EntryContext } from '@remix-run/node';
import { Response } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToPipeableStream } from 'react-dom/server';
import { createInstance } from 'i18next';
import i18next from './i18next.server';
import { getContext } from './core-server/http-utils.server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import Backend from 'i18next-fs-backend';
import { availableLanguages, availableTranslationDomains } from './core/LanguageAndMarket';
import { resolve as pathResolve } from 'node:path';

const ABORT_DELAY = 5000;

export default async function handleRequest(
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    remixContext: EntryContext,
) {
    let instance = createInstance();
    const requestContext = getContext(request);
    let ns = i18next.getRouteNamespaces(remixContext);
    await instance
        .use(initReactI18next) // Tell our instance to use react-i18next
        .use(Backend) // Setup our backend
        .init({
            supportedLngs: availableLanguages,
            fallbackLng: availableLanguages[0],
            defaultNS: availableTranslationDomains,
            // react: { useSuspense: false },
            lng: requestContext.language,
            ns: ['common', ...ns],
            backend: {
                loadPath: pathResolve('./public/locales/{{lng}}/{{ns}}.json'),
            },
        });

    return await new Promise((resolve, reject) => {
        let didError = false;

        const { pipe, abort } = renderToPipeableStream(
            <I18nextProvider i18n={instance}>
                <RemixServer context={remixContext} url={request.url} />
            </I18nextProvider>,
            {
                onShellReady: () => {
                    const body = new PassThrough();

                    responseHeaders.set('Content-Type', 'text/html');
                    let http2PushLinksHeaders = remixContext.matches
                        .flatMap(({ route: { module, imports } }) => [module, ...(imports || [])])
                        .filter(Boolean)
                        .concat([
                            remixContext.manifest.url,
                            remixContext.manifest.entry.module,
                            ...remixContext.manifest.entry.imports,
                        ]);

                    responseHeaders.set(
                        'Link',
                        (responseHeaders.has('Link') ? responseHeaders.get('Link') + ',' : '') +
                            http2PushLinksHeaders
                                .map((link: string) => `<${link}>; rel=preload; as=script; crossorigin=anonymous`)
                                .join(','),
                    );

                    resolve(
                        new Response(body, {
                            headers: responseHeaders,
                            status: didError ? 500 : responseStatusCode,
                        }),
                    );

                    pipe(body);
                },
                onShellError: (err) => {
                    reject(err);
                },
                onError: (error) => {
                    didError = true;
                    console.error(error);
                },
            },
        );

        setTimeout(abort, ABORT_DELAY);
    });
}
