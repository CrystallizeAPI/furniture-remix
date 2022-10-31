import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';
import { useAppContext } from '~/core/app-context/provider';
import { ItemViewComponentProps } from '~/lib/grid-tile/types';
import displayPriceFor from '~/lib/pricing/pricing';
import { Price } from '../price';

export const Product: React.FC<ItemViewComponentProps> = ({ item }) => {
    const name = item?.defaultVariant?.name || item.name;
    const image = item?.defaultVariant?.firstImage || item?.defaultVariant?.images?.[0];
    const { state, path } = useAppContext();
    const { percent: discountPercentage } = displayPriceFor(
        item?.defaultVariant,
        {
            default: 'default',
            discounted: 'sales',
        },
        state.currency.code,
    );
    const attributes = item?.defaultVariant?.attributes || item?.attributes;

    return (
        <Link
            to={path(item.path)}
            prefetch="intent"
            className="grid grid-rows-[1fr_minmax(25px_50px)_40px] place-items-stretch w-full min-h-full  justify-stretch items-stretch relative product-link"
        >
            {discountPercentage > 0 && (
                <div className="absolute top-3 right-2 bg-green2 items-center flex z-[20] justify-center rounded-full w-[45px] h-[45px] text-[#fff] text-sm">
                    -{discountPercentage}%
                </div>
            )}
            <div className="img-container img-contain img-border border-solid border border-[#dfdfdf] aspect-[3/4] bg-[#fff] rounded-md h-full overflow-hidden grow-1">
                <Image {...image} sizes="300px" loading="lazy" alt={name} />
            </div>
            <div className="pl-1">
                <h3 className="text-md line-clamp-2 overflow-hidden">{name}</h3>
            </div>
            <div className="flex gap-3 my-2">
                {attributes?.map((attribute: { attribute: string; value: string }) => (
                    <div className="text-xs bg-grey py-1 px-3 rounded" key={attribute.value}>
                        {attribute.value}
                    </div>
                ))}
            </div>
            <div className="pl-1">
                <Price variant={item.defaultVariant} size="small" />
            </div>
        </Link>
    );
};
