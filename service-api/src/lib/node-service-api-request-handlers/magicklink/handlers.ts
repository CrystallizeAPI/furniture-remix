import Koa from 'koa';
import jwt from 'jsonwebtoken';
import { MagickLinkConfirmArguments, MagickLinkRegisterArguments, MagickLinkUserInfos, MagickLinkUserInfosRequest } from "./types";

export async function handleMagickLinkRegisterRequest(request: MagickLinkUserInfosRequest, context: Koa.Context, args: MagickLinkRegisterArguments): Promise<MagickLinkUserInfos> {
    // we use a symetric key here to make it simple, but in production you should use a public/private key pair
    // which will allow you to verify the token client side too, (even if not really required it is a good idea)
    const magickToken = jwt.sign(request, args.jwtSecret, {
        expiresIn: '30m',
        audience: request.email,
        subject: 'magicklink',
        issuer: context.request.host,
    });
    const link = `http${context.secure ? 's' : ''}://${context.request.host}${args.confirmLinkPath.replace(':token', magickToken)}`;
    args.mailer(args.subject, request.email, args.from, args.buildHtml(request, link));
    return request;
}

export async function handleMagickLinkConfirmationRequest(request: any, context: Koa.Context, args: MagickLinkConfirmArguments): Promise<MagickLinkUserInfos> {
    const magickToken: string = (context.params.token || '') as string;
    try {
        const magickTokenDecoded: MagickLinkUserInfos = jwt.verify(magickToken, args.jwtSecret) as MagickLinkUserInfos;
        // now we create 2 tokens, one for the frontend to indicate that we are logged in and one for the service api in the Cookie
        // the token for the frontend is NOT a prood of login
        const isSupposedToBeLoggedInOnServiceApiToken = jwt.sign({
            email: magickTokenDecoded.email,
            firstname: magickTokenDecoded.firstname,
            lastname: magickTokenDecoded.lastname
        }, `${process.env.JWT_SECRET}`, {
            expiresIn: '1d',
            audience: magickTokenDecoded.email,
            subject: 'isSupposedToBeLoggedInOnServiceApi',
            issuer: context.request.host,
        });

        const isLoggedInOnServiceApiToken = jwt.sign({}, args.jwtSecret, {
            expiresIn: '1d',
            audience: magickTokenDecoded.email,
            subject: 'isLoggedInOnServiceApiToken',
            issuer: context.request.host,
        });
        context.cookies.set('jwt', isLoggedInOnServiceApiToken, { httpOnly: true, secure: context.secure });
        context.response.redirect(args.backLinkPath.replace(":token", isSupposedToBeLoggedInOnServiceApiToken));

        console.log(magickTokenDecoded);
        return magickTokenDecoded;

    } catch (exception) {
        console.log(exception);
        context.body = { exception };
    }
    return {} as MagickLinkUserInfos;
}


