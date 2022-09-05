import { getCurrencyFromCode } from '~/lib/pricing/currencies';

import { View } from '@react-pdf/renderer';

export const Price: React.FC<{
    children: number;
    currencyCode: string;
    className?: string;
}> = ({ children, currencyCode }) => {
    const currency = getCurrencyFromCode(currencyCode);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
    });

    return <View>{formatter.format(children)}</View>;
};
