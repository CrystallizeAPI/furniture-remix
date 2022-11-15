import { handleMagickLinkConfirmationRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { LoaderFunction, redirect } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/core-server/storefront.server';
import { authCookie } from '~/core-server/cookies.server';
import { buildLanguageMarketAwareLink } from '~/core/LanguageAndMarket';

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const config = require('platformsh-config').config();
    const frontendURL = config.isValidPlatform()
        ? config.getRoute('frontapp').url.replace(/\/$/, '').replace('*', storefront.config.identifier)
        : requestContext.baseUrl;

    const backLinkPath =
        requestContext.callbackPath !== ''
            ? requestContext.callbackPath
            : buildLanguageMarketAwareLink('/checkout', requestContext.language, requestContext.market);

    let cookie = {};
    const redirectUrl = await handleMagickLinkConfirmationRequestPayload(null, {
        token: params.token || '',
        host: requestContext.host,
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
