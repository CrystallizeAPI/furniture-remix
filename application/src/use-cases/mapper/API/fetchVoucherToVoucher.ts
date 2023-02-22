import { Voucher } from '../../contracts/Voucher';

export default (data: any): Voucher => {
    const expiresString = data.expires?.content?.datetime || null;
    const expires = expiresString ? new Date(expiresString) : null;
    return {
        itemId: data.id,
        code: data.name,
        value: {
            type: data.value?.content?.selectedComponent?.id,
            number: data.value?.content?.selectedComponent?.content?.number,
        },
        expires,
        isExpired: (expires && expires < new Date()) || false,
    };
};
