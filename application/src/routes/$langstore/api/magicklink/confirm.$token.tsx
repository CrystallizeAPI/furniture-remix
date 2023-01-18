import { LoaderFunction, redirect } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { authCookie } from '~/core/cookies.server';
import handleMagickLink from '~/use-cases/user/handleMagickLink';

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const config = require('platformsh-config').config();
    const frontendURL = config.isValidPlatform()
        ? config.getRoute('frontapp').url.replace(/\/$/, '').replace('*', storefront.config.identifier)
        : requestContext.baseUrl;

    const { redirectUrl, cookie } = await handleMagickLink(frontendURL, requestContext, params.token || '');

    return redirect(redirectUrl as string, {
        headers: {
            'Set-Cookie': await authCookie.serialize(cookie),
        },
    });
};
