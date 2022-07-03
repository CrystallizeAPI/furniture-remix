import { handleMagickLinkConfirmationRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { LoaderFunction, redirect } from '@remix-run/node';
import { getHost, isSecure } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { authCookie } from '~/core-server/cookies.server';

export const loader: LoaderFunction = async ({ request: httpRequest, params }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);

    const config = require('platformsh-config').config();
    const frontendURL = config.isValidPlatform()
        ? config.getRoute('frontapp').url.replace(/\/$/, '').replace('*', storefront.config.identifier)
        : `http${isSecure(httpRequest) ? 's' : ''}://${host}`;

    const url = new URL(httpRequest.url);
    const callbackPath = url.searchParams.get('callbackPath') || '';
    const backLinkPath = callbackPath !== '' ? callbackPath : '/checkout';

    let cookie = {};
    const redirectUrl = await handleMagickLinkConfirmationRequestPayload(null, {
        token: params.token || '',
        host,
        jwtSecret: `${process.env.JWT_SECRET}`,
        backLinkPath: `${frontendURL}${backLinkPath}?token=:token`,
        setCookie: (name: string, value: string) => {
            cookie = {
                ...cookie,
                [name]: value,
            };
        },
    });
    return redirect(redirectUrl as string, {
        headers: {
            'Set-Cookie': await authCookie.serialize(cookie),
        },
    });
};
