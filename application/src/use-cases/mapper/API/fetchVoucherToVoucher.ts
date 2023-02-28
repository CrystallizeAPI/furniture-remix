import { Voucher } from '../../contracts/Voucher';

export default (data: any): Voucher => {
    const expiresString = data.expires?.content?.datetime || null;
    const expiresDate = new Date(expiresString);
    expiresDate.setHours(23, 59, 59);
    const expires = expiresString ? expiresDate : null;
    const now = new Date();
    return {
        itemId: data.id,
        code: data.name,
        value: {
            type: data.value?.content?.selectedComponent?.id,
            number: data.value?.content?.selectedComponent?.content?.number,
        },
        expires,
        isExpired: (expires && expires < now) || false,
    };
};
