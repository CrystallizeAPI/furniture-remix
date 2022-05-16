import { HeadersFunction, json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { HttpCacheHeaderTagger, HttpCacheHeaderTaggerFromLoader } from "~/core/Http-Cache-Tagger";
import { fetchFolder, fetchProducts } from "~/core/UseCases";
import { Image } from "@crystallize/reactjs-components/dist/image";
import { Filter } from "~/core/components/filter";
import { getSuperFast } from "src/lib/superfast/SuperFast";

export const loader: LoaderFunction = async ({ request, params }) => {
    const path = `/shop/${params.folder}`;
    const superFast = await getSuperFast(request.headers.get("Host")!);
    const folder = await fetchFolder(superFast.apiClient, path);
    const products = await fetchProducts(superFast.apiClient, path);
    return json({ products, folder }, HttpCacheHeaderTagger('30s', '1w', [path]));
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
}

export default function FolderPage() {
    const { products, folder } = useLoaderData();
    let title = folder.components.find((component: any) => component.type === "singleLine")?.content?.text;
    let description = folder.components.find((component: any) => component.type === "richText")?.content?.plainText;

    return (
        <div className="lg:w-content mx-auto w-full">
            <h1 className="text-3xl font-bold mt-10 mb-4">{title}</h1>
            <p className="w-3/5 mb-10">{description}</p>
            <Filter />
            <div className="flex gap-5">
                {products.map((product: any) => {
                    return (
                        <div key={product.path} className="category-container">
                            <Image
                                {...product.defaultVariant.firstImage}
                                sizes="500px"
                            />
                            <p className="mt-5">
                                <Link to={product.path}>{product.name}</Link>
                            </p>
                            <p className="font-bold">${product.defaultVariant.price}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
