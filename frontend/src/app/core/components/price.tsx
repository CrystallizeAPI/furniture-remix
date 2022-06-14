import { ProductVariant } from '@crystallize/js-api-client';
import displayPriceFor from '~/lib/pricing/pricing';
import { Price as CrystallizePrice } from '~/lib/pricing/pricing-component';

export const Price: React.FC<{ variant: ProductVariant }> = ({ variant }) => {
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
        'EUR',
    );
    return (
        <div>
            {discountPrice > 0 ? (
                <div className="flex flex-wrap  flex-col">
                    <div className="line-through font-bold pt-1 text-sm">
                        <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                    </div>
                    <div className="flex gap-2 items-center ">
                        <div className="text-4xl font-bold text-green2">
                            <CrystallizePrice currencyCode={currency.code}>{discountPrice}</CrystallizePrice>
                        </div>
                        <div className="text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-bold ">
                            -{discountPercentage}%
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-4xl font-bold">
                    <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                </div>
            )}
        </div>
    );
};
