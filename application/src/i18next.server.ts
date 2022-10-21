import Backend from 'i18next-fs-backend';
import { resolve } from 'node:path';
import { RemixI18Next } from 'remix-i18next';
import { availableLanguages, availableTranslationDomains } from '~/core/LanguageAndMarket';

export default new RemixI18Next({
    detection: {
        supportedLanguages: availableLanguages,
        fallbackLanguage: availableLanguages[0],
    },
    i18next: {
        defaultNS: availableTranslationDomains,
        backend: { loadPath: resolve('./public/locales/{{lng}}/{{ns}}.json') },
    },
    backend: Backend,
});
