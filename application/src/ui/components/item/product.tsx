'use client';

import { Image } from '@crystallize/reactjs-components';
import Link from '~/bridge/ui/Link';
import { useAppContext } from '../../app-context/provider';
import displayPriceFor from '~/use-cases/checkout/pricing';
import { Price } from '../price';
import { ProductSlim } from '~/use-cases/contracts/Product';
import { DataMapper } from '~/use-cases/mapper';

export const Product: React.FC<{ item: ProductSlim }> = ({ item }) => {
    const { state, path } = useAppContext();
    const { percent: discountPercentage } = displayPriceFor(
        item.variant,
        {
            default: 'default',
            discounted: 'sales',
        },
        state.currency.code,
    );
    const attributesKeys = Object.keys(item.variant.attributes ?? {});
    return (
        <Link
            to={path(item.path)}
            data-testid="product-link"
            prefetch="intent"
            className="grid grid-rows-[1fr_minmax(25px_50px)_40px] place-items-stretch w-full min-h-full justify-stretch items-stretch relative product-link"
        >
            {discountPercentage > 0 && (
                <div className="absolute top-3 right-2 bg-green2 items-center flex z-[20] justify-center rounded-full w-[45px] h-[45px] text-[#fff] text-sm">
                    -{discountPercentage}%
                </div>
            )}
            <div className="img-container img-contain img-border border-solid border border-[#dfdfdf] aspect-[3/4] bg-[#fff] rounded-md h-full overflow-hidden grow-1">
                <Image {...item.variant.images[0]} sizes="300px" loading="lazy" fallbackAlt={item.name} />
            </div>
            <div className="pl-1">
                <p className="text-md line-clamp-2 overflow-hidden">{item.name}</p>
            </div>
            {attributesKeys.length > 0 && (
                <div className="flex gap-3 my-2">
                    {attributesKeys.map((key) => (
                        <div className="text-xs bg-grey py-1 px-3 rounded" key={key}>
                            {item.variant.attributes[key]}
                        </div>
                    ))}
                </div>
            )}

            <div className="pl-1">
                <Price variant={item.variant} size="small" />
            </div>
        </Link>
    );
};

export const ProductFromCell: React.FC<{ item: any }> = ({ item }) => {
    const mapper = DataMapper();
    const productVariant = mapper.API.Object.APIProductVariantToProductVariant(item.defaultVariant);
    return (
        <Product
            item={{
                id: item.id,
                name: item.name,
                path: item.path,
                variant: productVariant,
                topics: [],
            }}
        />
    );
};
