import { createRepository } from '@crystallize/node-service-api-request-handlers';
import nodemailer from 'nodemailer';
import { Mailer } from './contracts/Mailer';
import { configureStorage } from './storage.server';

export const storage = configureStorage(`${process.env?.STORAGE_DSN}`);
export const memoryStorage = configureStorage('memory://');
export const cartWrapperRepository = createRepository(storage);

export function createMailer(dsn: string): Mailer {
    if (dsn.startsWith('sendgrid://')) {
        const sgMail = require('@sendgrid/mail');
        const key = dsn.split('://')[1];
        sgMail.setApiKey(key);

        return (subject: string, to: string[] | string, from: string, html: string) => {
            return sgMail.send({
                from,
                to,
                subject,
                html,
            });
        };
    }

    let realDSN = dsn;
    const config = require('platformsh-config').config();
    if (config.isValidPlatform()) {
        realDSN = `smtp://${process.env.PLATFORM_SMTP_HOST}:25/?pool=true`;
    }
    const transporter = nodemailer.createTransport(realDSN);
    transporter.verify((error, success) => {
        if (!success) {
            console.log(`DSN ${realDSN}: ${error}`);
        }
    });

    return (subject: string, to: string[] | string, from: string, html: string) => {
        return transporter.sendMail({
            from,
            to,
            subject,
            html,
        });
    };
}
