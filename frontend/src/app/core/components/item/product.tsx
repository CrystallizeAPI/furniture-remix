import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';
import { ItemViewComponentProps } from '~/lib/grid-tile/types';
import displayPriceFor from '~/lib/pricing/pricing';
import { Price as CrystallizePrice } from '~/lib/pricing/pricing-component';

export const Product: React.FC<ItemViewComponentProps> = ({ item }) => {
    const image = item?.defaultVariant?.firstImage || item?.defaultVariant?.images?.[0];
    const {
        default: defaultPrice,
        discounted: discountPrice,
        percent: discountPercentage,
        currency,
    } = displayPriceFor(
        item?.defaultVariant,
        {
            default: 'default',
            discounted: 'sales',
        },
        'EUR',
    );

    return (
        <Link to={item.path} prefetch="intent" className="flex flex-col h-full relative">
            {discountPercentage > 0 && (
                <div className="absolute top-3 right-2 bg-green2 p-3 rounded-full w-[50px] h-[50px] text-[#fff]">
                    {discountPercentage}%
                </div>
            )}
            <div className="img-container img-contain border-solid border border-[#dfdfdf] min-h-[220px] bg-[#fff] rounded-md h-full overflow-hidden grow-1">
                <Image {...image} sizes="300px" loading="lazy" />
            </div>
            <div className="grow-0">
                <h3>{item.name}</h3>

                {discountPrice > 0 ? (
                    <div className="flex items-center gap-3">
                        <p className="text-md text-green2 font-bold">
                            <CrystallizePrice currencyCode={currency.code}>{discountPrice}</CrystallizePrice>
                        </p>
                        <p className="text-sm line-through">
                            <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                        </p>
                    </div>
                ) : (
                    <div>
                        <p className="text-md font-bold">
                            <CrystallizePrice currencyCode={currency.code}>{defaultPrice}</CrystallizePrice>
                        </p>
                    </div>
                )}
            </div>
        </Link>
    );
};
