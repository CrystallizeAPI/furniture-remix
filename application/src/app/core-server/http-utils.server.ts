export function isSecure(request: Request): boolean {
    return request.headers.get('x-forwarded-proto')! === 'https' || request.url.startsWith('https');
}

export function getHost(request: Request): string {
    if (!request.headers.has('Host') || request.headers.get('Host') === '') {
        throw new Error('Runtime Fatal: Host is not found on the Request.');
    }
    return request.headers.get('Host')!;
}

export function validatePayload<T>(schema: any | null, payload: unknown): T {
    if (!schema) {
        return payload as T;
    }
    return schema.parse(payload);
}
