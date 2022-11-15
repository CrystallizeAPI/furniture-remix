import {
    handleMagickLinkRegisterPayload,
    magickLinkUserInfosPayload,
    MagickLinkUserInfosPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getStoreFront } from '~/core-server/storefront.server';
import mjml2html from 'mjml';
import { createMailer } from '~/core-server/services.server';
import { getContext, validatePayload } from '~/use-cases/http/utils';
import { buildLanguageMarketAwareLink } from '~/core/LanguageAndMarket';

export const action: ActionFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const mailer = createMailer(`${process.env.MAILER_DSN}`);
    const payload: any = await request.json();
    const confirmPath = buildLanguageMarketAwareLink(
        '/api/magicklink/confirm/:token',
        requestContext.language,
        requestContext.market,
    );
    const data = await handleMagickLinkRegisterPayload(
        validatePayload<MagickLinkUserInfosPayload>(payload, magickLinkUserInfosPayload),
        {
            mailer,
            jwtSecret: `${process.env.JWT_SECRET}`,
            confirmLinkUrl:
                `${requestContext.baseUrl}${confirmPath}` +
                (requestContext.callbackPath !== '' ? `?callbackPath=${requestContext.callbackPath}` : ''),
            subject: `[Crystallize - ${storefront.config.identifier}] - Magic link login`,
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
            host: requestContext.host,
        },
    );
    return json(data);
};
