export type Voucher = {
    itemId: string;
    code: string;
    value: {
        number: number;
        unit?: string;
        type: string;
    };
    expires: Date | null;
    isExpired: boolean;
};
