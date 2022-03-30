import { z } from "zod";

export const magickLinkUserInfosRequest = z.object({
    email: z.string(),
    firstname: z.string(),
    lastname: z.string()
}).strict();

export type MagickLinkUserInfosRequest = z.infer<typeof magickLinkUserInfosRequest>;
export type MagickLinkUserInfos = MagickLinkUserInfosRequest;

export type MagickLinkRegisterArguments = {
    mailer: (subject: string, to: string[] | string, from: string, html: string) => void,
    jwtSecret: string,
    confirmLinkPath: string,
    subject: string,
    from: string,
    buildHtml: (request: MagickLinkUserInfos, link: string) => string,
}

export type MagickLinkConfirmArguments = {
    jwtSecret: string,
    backLinkPath: string,
}
