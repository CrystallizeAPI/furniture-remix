import { Link } from '@remix-run/react';
import { Image } from '@crystallize/reactjs-components/dist/image';

export const RelatedProduct = ({ product }: { product: any }) => {
    let image = product?.defaultVariant?.images;
    let price = product?.defaultVariant?.price;
    return (
        <div className="pb-5">
            <Link to={product.path} prefetch="intent">
                <div className="img-container rounded-md overflow-hidden">
                    <Image {...image?.[0]} size="20vw" loading="lazy" />
                </div>
                <div className=" py-5">
                    <h4>{product?.name}</h4>
                    <p className="font-semibold">€{price}</p>
                </div>
            </Link>
        </div>
    );
};
