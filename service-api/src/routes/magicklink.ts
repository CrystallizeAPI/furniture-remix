import {
    MagickLinkUserInfosPayload,
    magickLinkUserInfosPayload,
    handleMagickLinkConfirmationRequestPayload,
    handleMagickLinkRegisterPayload,
    MagickLinkRegisterArguments,
    MagickLinkConfirmArguments,
} from '@crystallize/node-service-api-request-handlers';
import { StandardRouting, ValidatingRequestRouting } from '@crystallize/node-service-api-router';
import Koa from 'koa';
import mjml2html from 'mjml';
import { createMailer } from '../services';

const mailer = createMailer(`${process.env.MAILER_DSN}`);

export const magickLinkBodyConvertedRoutes: ValidatingRequestRouting = {
    '/register/email/magicklink': {
        post: {
            schema: magickLinkUserInfosPayload,
            handler: handleMagickLinkRegisterPayload,
            args: (context: Koa.Context): MagickLinkRegisterArguments => {
                return {
                    mailer,
                    jwtSecret: `${process.env.JWT_SECRET}`,
                    confirmLinkUrl: `http${context.secure ? 's' : ''}://${
                        context.request.host
                    }/confirm/email/magicklink/:token`,
                    subject: '[Crystallize - Boilerplate] - Magic link login',
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
                    host: context.request.host,
                };
            },
        },
    },
    '/confirm/email/magicklink/:token': {
        get: {
            schema: null,
            handler: handleMagickLinkConfirmationRequestPayload,
            args: (context: Koa.Context): MagickLinkConfirmArguments => {
                const config = require('platformsh-config').config();
                const frontendURL = config.isValidPlatform()
                    ? config.getRoute('frontapp').url.replace(/\/$/, '').replace('*', context.superFast.identifier)
                    : (process.env.FRONTEND_URL_PATTERN || '').replace('%s', context.superFast.config.identifier);
                return {
                    token: context.params.token,
                    host: context.request.host,
                    jwtSecret: `${process.env.JWT_SECRET}`,
                    backLinkPath: `${frontendURL}/checkout?token=:token`,
                    setCookie: (name: string, value: string) => {
                        context.cookies.set(name, value, { httpOnly: false, secure: context.secure });
                    },
                };
            },
        },
    },
};

export const magickLinkStandardRoutes: StandardRouting = {
    '/confirm/email/magicklink/:token': {
        get: {
            handler: async (ctx: Koa.Context) => {
                ctx.response.redirect(ctx.response.body as string);
            },
        },
    },
};
