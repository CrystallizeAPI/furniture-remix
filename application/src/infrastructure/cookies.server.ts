import { createCookie } from '@remix-run/node';

export const authCookie = createCookie('authentication', {
    maxAge: 604_800,
});
