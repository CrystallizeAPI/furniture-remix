import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';

export const GridProduct = ({ item }: { item: any }) => {
    return (
        <Link to={item.path} prefetch="intent">
            <div className="flex flex-col h-full justify-between border-[1px] border-solid border-[transparent] hover:border-[#dfdfdf]">
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
