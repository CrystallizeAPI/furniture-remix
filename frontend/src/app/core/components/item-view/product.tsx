import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';

export const GridProduct = ({ item }: { item: any }) => {
    return (
        <Link to={item.path}>
            <div className="flex flex-col h-full justify-between">
                <div>
                    <Image {...item?.defaultVariant?.images?.[0]} />
                </div>
                <div className="my-2 justify-self-end">
                    <h3>{item.name}</h3>
                    <p className="font-bold text-sm">€{item?.defaultVariant?.price}</p>
                </div>
            </div>
        </Link>
    );
};
