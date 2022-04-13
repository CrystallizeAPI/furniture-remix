import { HeadersFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Link } from "react-router-dom";
import { HttpCacheHeaderTagger, HttpCacheHeaderTaggerFromLoader } from "~/core/Http-Cache-Tagger";
import { fetchProducts } from "~/core/UseCases";

export const loader: LoaderFunction = async ({ params }) => {
    const path = `/shop/${params.folder}`;
    const products = await fetchProducts(path);
    return json({ products }, HttpCacheHeaderTagger('30s', '1w', [path]));
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
}

export default function FolderPage() {
    const { products } = useLoaderData();
    return (
        <div>
            <h1>Folder Page</h1>
            <p>Should list the Product</p>
            <ul>
                {products.map((product: any) => {
                    return <li key={product.path}>
                        <p><Link to={product.path}>{product.name}</Link></p>
                        <img src={product.defaultVariant.firstImage.variants[2].url} alt={product.defaultVariant.firstImage.altText || product.name} />

                        <p>Price: {product.defaultVariant.price}</p>

                        {product.topics && <p>Topics:{product.topics.map((topic: any, index: number) => <span key={topic.path + index}><Link to={`/todo/topic${topic.path}`}>{topic.name}</Link>, </span>)} </p>}
                    </li>
                })}
            </ul>

        </div >
    );
}
