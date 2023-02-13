import { authCookie } from '~/core/cookies.server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function authenticate(request: Request): Promise<{ user: any } | undefined> {
    const unauthorized = (code: number) => {
        throw new Error('Unauthorized. Error code: ' + code);
    };
    const cookieHeader = request.headers.get('Cookie');
    const cookie = (await authCookie.parse(cookieHeader)) || {};

    const token = cookie.jwt;
    if (token === undefined) {
        unauthorized(1);
    }
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`);
        if (decoded.sub === 'isLoggedInOnServiceApiToken') {
            return {
                user: jwt.decode(token as string) as JwtPayload,
            };
        }
        unauthorized(3);
    } catch (exception: any) {
        console.log(exception.message);
        unauthorized(2);
    }
    unauthorized(4);
}

export async function authenticatedUser(request: Request): Promise<any> {
    try {
        let auth = await authenticate(request);
        return auth?.user;
    } catch (e) {
        return false;
    }
}

export async function isAuthenticated(request: Request): Promise<boolean> {
    try {
        await authenticate(request);
        return true;
    } catch (e) {
        return false;
    }
}
