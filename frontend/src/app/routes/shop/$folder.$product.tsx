import { fetchProduct } from "~/core/UseCases";
import { HttpCacheHeaderTagger, HttpCacheHeaderTaggerFromLoader } from "~/core/Http-Cache-Tagger";
import { useLocalCart } from "~/core/hooks/useLocalCart";
import { HeadersFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async ({ params }) => {
    const path = `/shop/${params.folder}/${params.product}`;
    const product = await fetchProduct(path);
    return json({ product }, HttpCacheHeaderTagger('30s', '1w', [path]));
}
export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
}

export default function ProductPage() {
    const { product } = useLoaderData();
    return (
        <div>
            <h1>{product.name}</h1>
            {product.variants.map((variant: any, index: number) => <Variant key={variant.id} variant={variant} />)}
        </div>
    );
}

const Variant: React.FC<{ variant: any }> = ({ variant }) => {

    const { add: addToCart } = useLocalCart();

    return <div>
        <h2>{variant.name}</h2>
        ${variant.price}
        <p>Sku: {variant.sku}</p>
        <button onClick={() => {
            addToCart(variant);
        }}>Add to cart</button>

    </div >
};
