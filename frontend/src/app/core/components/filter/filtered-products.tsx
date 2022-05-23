import { Link } from '@remix-run/react';
import { Image } from '@crystallize/reactjs-components';

export const FilteredProducts = ({ products }: { products: any }) => {
    return (
        <div className="mt-10">
            <h2 className="font-bold text-lg mt-5">Search results ({products.length})</h2>

            <div className="flex gap-10 flex-wrap">
                {products.map((product: any, index: number) => (
                    <div key={index} className="category-container w-[200px] h-[300px] mt-5">
                        <img src={product?.node?.matchingVariant?.images?.[0]?.url} className="w-60" />
                        <p className="mt-4">
                            <Link to={product?.node?.path}>{product?.node?.name}</Link>
                        </p>
                        <p className="font-bold">${product?.node?.matchingVariant?.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProductsList = ({ products }: { products: any }) => {
    return (
        <div className="flex gap-5">
            {products?.map((product: any) => {
                return (
                    <div key={product.path} className="category-container">
                        <Image {...product.defaultVariant.firstImage} sizes="500px" />
                        <p className="mt-5">
                            <Link to={product.path}>{product.name}</Link>
                        </p>
                        <p className="font-bold">${product.defaultVariant.price}</p>
                    </div>
                );
            })}
        </div>
    );
};
