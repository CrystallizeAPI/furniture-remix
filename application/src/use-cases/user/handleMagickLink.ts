import { handleMagickLinkConfirmationRequestPayload } from '@crystallize/node-service-api-request-handlers';
import { buildLanguageMarketAwareLink } from '../LanguageAndMarket';
import { RequestContext } from '../http/utils';

export default async (frontendUrl: string, context: RequestContext, token: string) => {
    const backLinkPath =
        context.callbackPath !== ''
            ? context.callbackPath
            : buildLanguageMarketAwareLink('/checkout', context.language, context.market);

    let cookie = {};
    const redirectUrl = await handleMagickLinkConfirmationRequestPayload(null, {
        token: token,
        host: context.host,
        jwtSecret: `${process.env.JWT_SECRET}`,
        backLinkPath: `${frontendUrl}${backLinkPath}?token=:token`,
        setCookie: (name: string, value: string) => {
            cookie = {
                ...cookie,
                [name]: value,
            };
        },
    });

    return {
        redirectUrl,
        cookie,
    };
};
