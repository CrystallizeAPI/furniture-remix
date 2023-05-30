import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import jwt from 'jsonwebtoken';

export default async (storeFrontConfig: TStoreFrontConfig) => {
    const payload = {
        access_key: `${process.env.MONTONIO_ACCESS_KEY ?? storeFrontConfig?.configuration?.MONTONIO_ACCESS_KEY}`,
    };
    const token = jwt.sign(
        payload,
        `${process.env.MONTONIO_SECRET_KEY ?? storeFrontConfig?.configuration?.MONTONIO_SECRET_KEY}`,
        {
            algorithm: 'HS256',
            expiresIn: '1h',
        },
    );
    const response = await fetch(
        `https://api.${
            process.env.MONTONIO_ORIGIN ?? storeFrontConfig?.configuration?.MONTONIO_ORIGIN
        }/pis/v2/merchants/payment_methods`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        },
    );
    return await response.json();
};
