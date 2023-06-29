import {
    VippsAppCredentials,
    handleVippsLoginOAuthRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import { buildLanguageMarketAwareLink } from '../LanguageAndMarket';
import { RequestContext } from '../http/utils';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';

export default async (storeFrontConfig: TStoreFrontConfig, frontendUrl: string, context: RequestContext) => {
    const credentials: VippsAppCredentials = {
        origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
        clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
        clientSecret: process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
        merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
        subscriptionKey:
            process.env.VIPPS_SUBSCRIPTION_KEY ?? storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ?? '',
    };
    const code = context.url.searchParams.get('code') ?? '';
    const backLinkPath =
        context.callbackPath !== ''
            ? context.callbackPath
            : buildLanguageMarketAwareLink('/checkout', context.language, context.market);
    let cookie = {};
    const redirectUrl = await handleVippsLoginOAuthRequestPayload(
        {
            code,
            state: context.url.searchParams.get('state') ?? '',
        },
        {
            ...credentials,
            host: context.host,
            expectedState: 'crystalGenericState12345',
            redirectUri: `${frontendUrl}/${context.language}/api/vipps/connect`,
            jwtSecret: `${process.env.JWT_SECRET}`,
            backLinkPath: `${frontendUrl}${backLinkPath}?token=:token`,
            setCookie: (name: string, value: string) => {
                cookie = {
                    ...cookie,
                    [name]: value,
                };
            },
            onUserInfos: async (userInfos) => {
                console.log('Vipps User infos fetched', userInfos);
            },
        },
    );
    return {
        redirectUrl,
        cookie,
    };
};
