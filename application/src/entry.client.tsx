import { RemixBrowser } from '@remix-run/react';
import i18next from 'i18next';
import { hydrateRoot } from 'react-dom/client';
import Backend from 'i18next-http-backend';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { getInitialNamespaces } from 'remix-i18next';
import { availableLanguages, availableTranslationDomains } from './core/LanguageAndMarket';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(Backend)
    .init({
        supportedLngs: availableLanguages,
        defaultNS: availableTranslationDomains,
        fallbackLng: availableLanguages[0],
        ns: getInitialNamespaces(),
        // react: { useSuspense: false },
        backend: { loadPath: '/locales/{{lng}}/{{ns}}.json' },
        detection: {
            order: ['htmlTag'],
            caches: [],
        },
    })
    .then(() => {
        return hydrateRoot(
            document,
            <I18nextProvider i18n={i18next}>
                <RemixBrowser />
            </I18nextProvider>,
        );
    });
