import { getCurrencyFromCode } from '~/use-cases/contracts/Currency';
import { DisplayPrice as TDisplayPrice } from '~/use-cases/checkout/pricing';

export const Price: React.FC<{
    children: number;
    currencyCode: string;
    className?: string;
}> = ({ children, className = '', currencyCode }) => {
    const currency = getCurrencyFromCode(currencyCode);

    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: 2,
        maximumFractionDigits: 5,
    });

    return <span className={`crystallize-price ${className}`}>{formatter.format(children)}</span>;
};

// Generic display price component, often rewrited on project
export const DiscountedPrice: React.FC<{ price: TDisplayPrice; className?: string }> = ({ price, className = '' }) => {
    if (price.discounted) {
        return (
            <span className={`crystallize-discounted-price ${className}`}>
                <del>
                    <Price currencyCode={price.currency.code} className="font-medium block text-right text-sm">
                        {price.default}
                    </Price>
                </del>
                <Price currencyCode={price.currency.code}>{price.discounted}</Price>
                {price.percent > 0 && <span className={`crystallize-discount-percent`}>-{price.percent}%</span>}
            </span>
        );
    }
    return (
        <Price className={className} currencyCode={price.currency.code}>
            {price.default}
        </Price>
    );
};
