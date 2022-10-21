export const availableLanguages = ['en', 'no'];
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
