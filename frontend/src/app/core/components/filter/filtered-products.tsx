import { Product } from '~/core/components/item/product';
export const FilteredProducts = ({ products }: { products: any }) => {
    return (
        <div className="mt-10">
            <h2 className="font-medium text-lg my-5">Found {products.length} products</h2>
            <div className="md:grid lg:grid-cols-4 grid-cols-3 gap-5 flex flex-wrap">
                {products.map((product: any, index: number) => {
                    return (
                        <Product
                            key={index}
                            item={{
                                ...product.node,
                                defaultVariant: {
                                    ...product.node.matchingVariant,
                                    firstImage: product.node.matchingVariant.images?.[0],
                                },
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export const ProductsList = ({ products }: { products: any }) => {
    return (
        <div className="md:grid lg:grid-cols-4 grid-cols-3 gap-5 flex flex-wrap">
            {products?.map((product: any) => {
                return <Product item={product} />;
            })}
        </div>
    );
};
