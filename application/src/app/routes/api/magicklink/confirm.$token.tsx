import {
    handleMagickLinkConfirmationRequestPayload,
    magickLinkUserInfosPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, redirect } from '@remix-run/node';
import { getHost, validatePayload } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const action: ActionFunction = async ({ request: httpRequest, params }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);

    const config = require('platformsh-config').config();
    const frontendURL = config.isValidPlatform()
        ? config.getRoute('frontapp').url.replace(/\/$/, '').replace('*', storefront.config.identifier)
        : (process.env.FRONTEND_URL_PATTERN || '').replace('%s', storefront.config.identifier);

    const url = new URL(httpRequest.url);
    const callbackPath = url.searchParams.get('callbackPath') || '';
    const backLinkPath = callbackPath !== '' ? callbackPath : '/checkout';

    const redirectUrl = await handleMagickLinkConfirmationRequestPayload(
        validatePayload(await httpRequest.json(), null),
        {
            token: params.token || '',
            host,
            jwtSecret: `${process.env.JWT_SECRET}`,
            backLinkPath: `${frontendURL}${backLinkPath}?token=:token`,
            setCookie: (name: string, value: string) => {
                // context.cookies.set(name, value, { httpOnly: false, secure: isSecure });
            },
        },
    );

    return redirect(redirectUrl as string);
};
