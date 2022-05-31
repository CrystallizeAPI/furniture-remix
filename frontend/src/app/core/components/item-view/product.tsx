import { Image } from '@crystallize/reactjs-components';
import { Link } from '@remix-run/react';

export const GridProduct = ({ item, layout }: { layout: any; item: any }) => {
    console.log({ item });
    console.log({ layout });
    return (
        <Link to={item.path} prefetch="intent">
            <div className={`flex flex-col justify-between`}>
                <div className="img-container">
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
