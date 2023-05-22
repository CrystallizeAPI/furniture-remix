import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { CartWrapper } from '@crystallize/node-service-api-request-handlers';
import jwt from 'jsonwebtoken';

export default async (cartWrapper: CartWrapper, storeFrontConfig: TStoreFrontConfig) => {
    const payload = {
        access_key: `${
            process.env.MONTONIO_SHIPPING_ACCESS_KEY ?? storeFrontConfig?.configuration?.MONTONIO_SHIPPING_ACCESS_KEY
        }`,
    };
    const token = jwt.sign(
        payload,
        `${process.env.MONTONIO_SHIPPING_SECRET_KEY ?? storeFrontConfig?.configuration?.MONTONIO_SHIPPING_SECRET_KEY}`,
        {
            algorithm: 'HS256',
            expiresIn: '1h',
        },
    );

    const response = await fetch(
        `https://${
            process.env.MONTONIO_SHIPPING_ORIGIN ?? storeFrontConfig?.configuration?.MONTONIO_SHIPPING_ORIGIN
        }/shipments/label-from-store`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                merchant_references: [cartWrapper.cartId],
            }),
        },
    );
    const data = await response.json();
    return data.url;
};
