import { availableLanguages } from '../LanguageAndMarket';

type Request = {
    url: string;
    headers: {
        has: (key: string) => boolean;
        get: (key: string) => string | null | undefined;
    };
};

function isSecure(request: Request): boolean {
    return request.headers.get('x-forwarded-proto')! === 'https' || request.url.startsWith('https');
}

function getHost(request: Request): string {
    if (process.env?.SUPERFAST_HOST) {
        return process.env.SUPERFAST_HOST;
    }
    if (!request.headers.has('Host') || request.headers.get('Host') === '') {
        throw new Error('Runtime Fatal: Host is not found on the Request.');
    }
    return request.headers.get('Host')!;
}

export type RequestContext = {
    locale: string;
    language: string;
    isSecure: boolean;
    host: string;
    market?: string;
    isPreview: boolean;
    callbackPath: string;
    url: URL;
    baseUrl: string;
};

export function getContext(request: Request): RequestContext {
    const url = new URL(request.url);
    const langMarket = url.pathname.split('/')[1] ?? '';
    const language = langMarket.split('-')[0] ?? availableLanguages[0];
    const isHttps = isSecure(request);
    const host = getHost(request);
    return {
        locale: `${language}-${language.toUpperCase()}`,
        language,
        isSecure: isHttps,
        host,
        isPreview: Boolean(url.searchParams?.has('preview')),
        url,
        callbackPath: url.searchParams.get('callbackPath') || '',
        baseUrl: `${isHttps ? 'https' : 'http'}://${host}`,
    };
}

export function validatePayload<T>(payload: unknown, schema: any | null): T {
    if (!schema) {
        return payload as T;
    }
    return schema.parse(payload);
}
