import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';
import { ItemViewComponentProps } from '../../../../lib/grid-tile/types';

export const Product: React.FC<ItemViewComponentProps> = ({ item }) => {
    const image = item?.defaultVariant?.firstImage || item?.defaultVariant?.images?.[0];
    return (
        <Link to={item.path} prefetch="intent" className="flex flex-col h-full">
            <div className="img-container img-contain border-solid border border-[#dfdfdf] min-h-[220px] bg-[#fff] rounded-md h-full overflow-hidden grow-1">
                <Image {...image} sizes="300px" loading="lazy" />
            </div>
            <div className="grow-0">
                <h3>{item.name}</h3>
                <p className="font-bold text-sm">€{item?.defaultVariant?.price}</p>
            </div>
        </Link>
    );
};
