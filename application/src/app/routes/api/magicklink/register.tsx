import {
    handleMagickLinkRegisterPayload,
    magickLinkUserInfosPayload,
    MagickLinkUserInfosPayload,
} from '@crystallize/node-service-api-request-handlers';
import { ActionFunction, json } from '@remix-run/node';
import { getStoreFront } from '~/core-server/storefront.server';
import mjml2html from 'mjml';
import { createMailer } from '~/core-server/services.server';
import { getHost, isSecure, validatePayload } from '~/core-server/http-utils.server';

export const action: ActionFunction = async ({ request: httpRequest }) => {
    const host = getHost(httpRequest);
    const { secret: storefront } = await getStoreFront(host);
    const mailer = createMailer(`${process.env.MAILER_DSN}`);
    const url = new URL(httpRequest.url);
    const callbackPath = url.searchParams.get('callbackPath') || '';
    const data = handleMagickLinkRegisterPayload(
        validatePayload(await httpRequest.json(), magickLinkUserInfosPayload),
        {
            mailer,
            jwtSecret: `${process.env.JWT_SECRET}`,
            confirmLinkUrl:
                `http${isSecure(httpRequest) ? 's' : ''}://${host}/api/magicklink/confirm/:token` +
                (callbackPath !== '' ? `?callbackPath=${callbackPath}` : ''),
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
            host,
        },
    );
    return json(data);
};
