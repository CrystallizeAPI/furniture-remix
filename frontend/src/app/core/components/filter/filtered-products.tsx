import { Link } from '@remix-run/react';
import { Image } from '@crystallize/reactjs-components';

export const FilteredProducts = ({ products }: { products: any }) => {
    return (
        <div className="mt-10">
            <h2 className="font-bold text-lg mt-5">Found {products.length} products</h2>

            <div className="grid grid-cols-5 gap-6 ">
                {products.map((product: any, index: number) => (
                    <Link key={index} to={product?.node?.path}>
                        <div className="category-container w-[200px] h-[300px] mt-5">
                            <div className="img-container">
                                <Image {...product?.node?.matchingVariant?.images?.[0]} sizes="300px" loading="lazy" />
                            </div>
                            <p className="mt-4">{product?.node?.name}</p>
                            <p className="font-bold">€{product?.node?.matchingVariant?.price}</p>
                        </div>
                    </Link>
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
                    <Link to={product.path} key={product.path}>
                        <div className="mt-5">
                            <div className="img-container">
                                <Image {...product.defaultVariant.firstImage} sizes="300px" loading="lazy" />
                            </div>
                            <p className="mt-5">{product.name}</p>
                            <p className="font-bold">€{product.defaultVariant.price}</p>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
};
