import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';
import { ItemViewComponentProps } from '../../../../lib/grid-tile/types';

export const Product: React.FC<ItemViewComponentProps> = ({ item }) => {
    return (
        <Link to={item.path} prefetch="intent">
            <div className={`flex flex-col justify-between`}>
                <div className="img-container">
                    <Image {...item?.defaultVariant?.images?.[0]} sizes="300px" loading="lazy" />
                </div>
                <div className="my-2 justify-self-end">
                    <h3>{item.name}</h3>
                    <p className="font-bold text-sm">€{item?.defaultVariant?.price}</p>
                </div>
            </div>
        </Link>
    );
};
