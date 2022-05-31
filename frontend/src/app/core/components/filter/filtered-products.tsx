import { Link } from '@remix-run/react';
import { Image } from '@crystallize/reactjs-components';

export const FilteredProducts = ({ products }: { products: any }) => {
    return (
        <div className="mt-10">
            <h2 className="font-bold text-lg mt-5">Found {products.length} products</h2>

            <div className="grid grid-cols-5 gap-6 ">
                {products.map((product: any, index: number) => (
                    <div key={index} className="category-container w-[200px] h-[300px] mt-5">
                        <div className="img-container">
                            <Image {...product?.node?.matchingVariant?.images?.[0]} />
                        </div>
                        <p className="mt-4">
                            <Link to={product?.node?.path}>{product?.node?.name}</Link>
                        </p>
                        <p className="font-bold">€{product?.node?.matchingVariant?.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ProductsList = ({ products }: { products: any }) => {
    return (
        <div className="grid grid-cols-5 gap-6 w-full">
            {products?.map((product: any) => {
                return (
                    <div key={product.path} className="mt-5">
                        <div className="img-container">
                            <Image {...product.defaultVariant.firstImage} sizes="500px" />
                        </div>
                        <p className="mt-5">
                            <Link to={product.path}>{product.name}</Link>
                        </p>
                        <p className="font-bold">€{product.defaultVariant.price}</p>
                    </div>
                );
            })}
        </div>
    );
};
