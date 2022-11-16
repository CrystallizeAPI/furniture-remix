export type Mailer = (subject: string, to: string[] | string, from: string, html: string) => Promise<any>;
