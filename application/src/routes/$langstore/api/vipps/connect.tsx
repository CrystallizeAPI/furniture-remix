import { LoaderFunction, redirect } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { authCookie } from '~/core/cookies.server';
import handleVippsLogin from '~/use-cases/user/handleVippsLogin';

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const config = require('platformsh-config').config();
    const frontendURL = config.isValidPlatform()
        ? config.getRoute('frontapp').url.replace(/\/$/, '').replace('*', storefront.config.identifier)
        : requestContext.baseUrl;

    const { redirectUrl, cookie } = await handleVippsLogin(storefront.config, frontendURL, requestContext);
    return redirect(redirectUrl as string, {
        headers: {
            'Set-Cookie': await authCookie.serialize(cookie),
        },
    });
};
