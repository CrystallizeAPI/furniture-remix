import { CartWrapper } from '@crystallize/node-service-api-request-handlers';
import jwt from 'jsonwebtoken';
import { PickupPoint } from './types';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';

export default async (cartWrapper: CartWrapper, storeFrontConfig: TStoreFrontConfig) => {
    const pickupPoint: PickupPoint | undefined = cartWrapper?.extra?.pickupPoint;
    const payload = {
        access_key:
            process.env.MONTONIO_SHIPPING_ACCESS_KEY ??
            storeFrontConfig?.configuration?.MONTONIO_SHIPPING_ACCESS_KEY ??
            '',
    };
    const token = jwt.sign(
        payload,
        process.env.MONTONIO_SHIPPING_SECRET_KEY ?? storeFrontConfig?.configuration?.MONTONIO_SHIPPING_SECRET_KEY ?? '',
        {
            algorithm: 'HS256',
            expiresIn: '1h',
        },
    );

    let shipment: any = {
        merchant_reference: cartWrapper.cartId,
        sender_name: 'Crystallize Boilerplate Store Front - Montonio Showcase',
        sender_phone_country: '372',
        sender_phone_number: '55512345',
        sender_street_address_1: 'Kai 1, Tallinn',
        sender_locality: 'Harjumaa',
        sender_postal_code: '10111',
        sender_country: 'EE',
        shipping_first_name: cartWrapper.customer?.firstname || 'Unknown',
        shipping_last_name: cartWrapper.customer?.lastname || 'Unknown',
        shipping_phone_country: '372',
        shipping_phone_number: '55512345',
        shipping_country: 'EE',
        currency: cartWrapper.cart.total.currency,
        total: cartWrapper.cart.total.gross,
        parcels: [
            {
                weight: 1.0,
            },
        ],
    };

    if (pickupPoint) {
        shipment = {
            ...shipment,
            pickup_point_uuid: pickupPoint.uuid,
            shipping_method: `${pickupPoint?.provider_name}_${pickupPoint?.type}s`,
        };
    }
    const response = await fetch(
        `https://${
            process.env.MONTONIO_SHIPPING_ORIGIN ?? storeFrontConfig?.configuration?.MONTONIO_SHIPPING_ORIGIN ?? ''
        }/shipments`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(shipment),
        },
    );
    return await response.json();
};
