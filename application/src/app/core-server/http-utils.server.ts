export function isSecure(request: Request): boolean {
    return request.headers.get('x-forwarded-proto')! === 'https' || request.url.startsWith('https');
}

export function getHost(request: Request): string {
    if (process.env?.SUPERFAST_HOST) {
        return process.env.SUPERFAST_HOST;
    }
    if (!request.headers.has('Host') || request.headers.get('Host') === '') {
        throw new Error('Runtime Fatal: Host is not found on the Request.');
    }
    return request.headers.get('Host')!;
}

export function validatePayload<T>(payload: unknown, schema: any | null): T {
    if (!schema) {
        return payload as T;
    }
    return schema.parse(payload);
}
