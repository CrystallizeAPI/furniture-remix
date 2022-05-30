import { Link } from '@remix-run/react';

export const RelatedProduct = ({ product }: { product: any }) => {
    let image = product?.defaultVariant?.images;
    let price = product?.defaultVariant?.price;
    return (
        <div className="w-[300px] shadow-md pb-5 overflow-hidden">
            <Link to={product.path}>
                <img src={image?.[0]?.variants?.[8]?.url} />
                <div className="px-10 py-5">
                    <h4>{product?.name}</h4>
                    <p className="font-semibold">€{price}</p>
                </div>
            </Link>
        </div>
    );
};
