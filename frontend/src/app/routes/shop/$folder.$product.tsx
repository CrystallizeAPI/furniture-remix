import { HeadersFunction, json, LoaderFunction, useLoaderData } from "remix";
import { fetchProduct } from "~/core/UseCases";
import { HttpCacheHeaderTagger, HttpCacheHeaderTaggerFromLoader } from "~/core/Http-Cache-Tagger";
import { useLocalBasket } from "~/core/hooks/useLocalBasket";

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
            {product.variants.map((variant: any) => <Variant key={variant.name} variant={variant} />)}
        </div>
    );
}

const Variant: React.FC<{ variant: any }> = ({ variant }) => {

    const { basket, addToBasket } = useLocalBasket();

    return <div>
        <h2>{variant.name}</h2>
        ${variant.price}
        <p>Sku: {variant.sku}</p>
        <button onClick={() => {
            addToBasket(variant);
        }}>Add to cart</button>

    </div >
};
