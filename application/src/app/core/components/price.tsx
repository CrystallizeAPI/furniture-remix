import { ProductVariant } from '@crystallize/js-api-client';
import displayPriceFor from '~/lib/pricing/pricing';
import { Price as CrystallizePrice } from '~/lib/pricing/pricing-component';
import { useAppContext } from '../app-context/provider';

export const Price: React.FC<{ variant: ProductVariant; size?: string }> = ({ variant, size = 'medium' }) => {
    const { state } = useAppContext();
    const priceSize = {
        small: {
            default: 'text-md font-semibold',
            previous: 'line-through font-semibold pt-1 text-xs',
            discount: 'text-md font-semibold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-medium',
        },
        medium: {
            default: 'text-4xl font-bold',
            previous: 'line-through font-semibold pt-1 text-sm',
            discount: 'text-4xl font-bold text-green2',
            percentage: 'text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-bold',
        },
    };
    const {
        default: defaultPrice,
        discounted: discountPrice,
        percent: discountPercentage,
        currency,
    } = displayPriceFor(
        variant,
        {
            default: 'default',
            discounted: 'sales',
        },
        state.currency.code,
    );
    return (
        <div>
            {discountPrice > 0 ? (
                <div className="flex flex-wrap  flex-col">
                    <div className={priceSize[size as keyof typeof priceSize].previous}>
                        <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <div className={priceSize[size as keyof typeof priceSize].discount}>
                            <CrystallizePrice currencyCode={currency.code}>{discountPrice}</CrystallizePrice>
                        </div>
                        <div className={priceSize[size as keyof typeof priceSize].percentage}>
                            -{discountPercentage}%
                        </div>
                    </div>
                </div>
            ) : (
                <div className={priceSize[size as keyof typeof priceSize].default}>
                    <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                </div>
            )}
        </div>
    );
};
