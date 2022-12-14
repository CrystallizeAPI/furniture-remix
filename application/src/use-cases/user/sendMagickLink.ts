import {
    handleMagickLinkRegisterPayload,
    magickLinkUserInfosPayload,
    MagickLinkUserInfosPayload,
} from '@crystallize/node-service-api-request-handlers';
import mjml2html from 'mjml';
import { buildLanguageMarketAwareLink } from '../LanguageAndMarket';
import { RequestContext, validatePayload } from '../http/utils';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';

export default async (
    context: RequestContext,
    storefrontConfig: TStoreFrontConfig,
    payload: any,
    mailer: (subject: string, to: string[] | string, from: string, html: string) => void,
) => {
    const confirmPath = buildLanguageMarketAwareLink(
        '/api/magicklink/confirm/:token',
        context.language,
        context.market,
    );
    return await handleMagickLinkRegisterPayload(
        validatePayload<MagickLinkUserInfosPayload>(payload, magickLinkUserInfosPayload),
        {
            mailer,
            jwtSecret: `${process.env.JWT_SECRET}`,
            confirmLinkUrl:
                `${context.baseUrl}${confirmPath}` +
                (context.callbackPath !== '' ? `?callbackPath=${context.callbackPath}` : ''),
            subject: `[Crystallize - ${storefrontConfig.identifier}] - Magic link login`,
            from: 'hello@crystallize.com',
            buildHtml: (request: MagickLinkUserInfosPayload, link: string) =>
                mjml2html(
                    `<mjml>
                        <mj-body>
                        <mj-section>
                            <mj-column>
                            <mj-text>Hi there ${request.email}! Simply follow the link below to login.</mj-text>
                            <mj-button href="${link}" align="left">Click here to login</mj-button>
                            </mj-column>
                        </mj-section>
                        </mj-body>
                    </mjml>`,
                ).html,
            host: context.host,
        },
    );
};
