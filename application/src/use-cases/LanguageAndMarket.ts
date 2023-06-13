export const availableTranslationDomains = ['common'];

export const displayableLanguages = [
    {
        code: 'en',
        name: 'EN',
    },
    {
        code: 'no',
        name: 'NO',
    },
    // Uncomment to add more languages, content must be translated first (especially topics)
    // {
    //     code: 'fr',
    //     name: 'FR',
    // },
];
export const availableLanguages = [
    'en',
    'no',
    'fr',
    'de',
    'es',
    'it',
    'sv',
    'da',
    'nl',
    'pt',
    'pl',
    'ru',
    'ja',
    'zh',
    'ko',
    'ar',
    'tr',
    'th',
    'cs',
    'hu',
    'fi',
    'el',
    'he',
    'id',
    'ro',
    'sk',
    'uk',
    'vi',
    'bg',
    'hr',
    'lt',
    'lv',
    'sr',
    'sl',
    'et',
    'ka',
    'ms',
    'hi',
    'bn',
    'ta',
    'te',
    'ml',
    'ur',
    'fa',
    'ps',
    'sw',
    'am',
    'km',
    'lo',
    'my',
    'ne',
    'si',
    'pa',
    'gu',
    'mr',
    'sa',
    'kn',
    'sd',
    'or',
    'as',
    'ml',
    'cy',
    'is',
    'mk',
    'sq',
    'bs',
    'mt',
    'af',
    'az',
    'be',
    'bn',
    'bs',
    'ca',
    'cs',
    'cy',
    'da',
    'de',
    'el',
    'en',
    'es',
    'et',
    'fa',
    'fi',
    'fr',
    'gu',
    'he',
    'hi',
    'hr',
    'hu',
    'hy',
    'id',
    'is',
    'it',
    'ja',
    'ka',
    'km',
    'kn',
    'ko',
    'lt',
    'lv',
    'mk',
    'ml',
    'mr',
    'ms',
    'ne',
    'nl',
    'no',
    'or',
    'pa',
    'pl',
    'ps',
    'pt',
    'ro',
    'ru',
    'sa',
    'sd',
    'si',
    'sk',
    'sl',
    'sq',
    'sr',
    'sv',
    'sw',
    'ta',
    'te',
    'th',
    'tr',
    'uk',
    'ur',
    'vi',
    'zh',
];
export const availableMarkets = [];

export const isValidLanguage = (language: string) => availableLanguages.includes(language);

export const isValidMarket = (market?: string) => {
    if (!market) {
        return true;
    }
    if (availableMarkets.length === 0) {
        return true;
    }
    //@ts-ignore
    return availableMarkets.includes(market);
};
export const isValidLanguageMarket = (language: string, market?: string) => {
    if (!isValidLanguage(language)) {
        return false;
    }
    if (!isValidMarket(market)) {
        return false;
    }
    return true;
};

export const buildLanguageMarketAwareLink = (path: string, language: string, market?: string): string => {
    if (!isValidLanguageMarket(language, market)) {
        throw new Error(`Invalid language (${language}) or market (${market})`);
    }

    if (market && market.length > 0) {
        return `/${language}-${market}${path}`;
    }

    return `/${language}${path}`;
};
