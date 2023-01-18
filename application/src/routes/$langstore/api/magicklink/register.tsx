import { ActionFunction, json } from '@remix-run/node';
import { getStoreFront } from '~/use-cases/storefront.server';
import { createMailer } from '~/use-cases/services.server';
import { getContext } from '~/use-cases/http/utils';
import sendMagickLink from '~/use-cases/user/sendMagickLink';

export const action: ActionFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const mailer = createMailer(`${process.env.MAILER_DSN}`);
    const body: any = await request.json();
    const data = await sendMagickLink(requestContext, storefront.config, body, mailer);
    return json(data);
};
