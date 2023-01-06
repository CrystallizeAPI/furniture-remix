import jwt from 'jsonwebtoken';

export default async () => {
    const payload = {
        access_key: `${process.env.MONTONIO_SHIPPING_ACCESS_KEY}`,
    };
    const token = jwt.sign(payload, `${process.env.MONTONIO_SHIPPING_SECRET_KEY}`, {
        algorithm: 'HS256',
        expiresIn: '1h',
    });
    const response = await fetch(`https://${process.env.MONTONIO_SHIPPING_ORIGIN}/pickup-points`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    return await response.json();
};
