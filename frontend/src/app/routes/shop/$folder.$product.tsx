import { fetchProduct } from "~/core/UseCases";
import {
  HttpCacheHeaderTagger,
  HttpCacheHeaderTaggerFromLoader,
} from "~/core/Http-Cache-Tagger";
import { useLocalBasket } from "~/core/hooks/useLocalBasket";
import { HeadersFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Image } from "@crystallize/reactjs-components/dist/image";
import StockIcon from "~/assets/stockIcon.svg";

export const loader: LoaderFunction = async ({ params }) => {
  const path = `/shop/${params.folder}/${params.product}`;
  const product = await fetchProduct(path);
  return json({ product }, HttpCacheHeaderTagger("30s", "1w", [path]));
};
export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export default function ProductPage() {
  const { product } = useLoaderData();
  let title = product.components.find(
    (component: any) => component.type === "singleLine"
  )?.content?.text;
  let description = product.components.find(
    (component: any) => component.type === "richText"
  )?.content?.plainText;
  const { addToBasket } = useLocalBasket();
  
  return (
    <div className="lg:w-content mx-auto w-full">
      <div className="flex gap-5">
        <Image {...product.variants[0].images[0]} />
        <div className="w-3/5 flex flex-col gap-5 mt-5">
          <h1 className="font-bold text-4xl">{title}</h1>
          <p>{description}</p>
          <div className="flex justify-between items-center">
            <p className="font-bold">${product.variants[0].price}</p>
            <button className="bg-buttonBg px-10 py-3 rounded font-buttonText" onClick={() => {
                addToBasket(product.variants[0]);
            }}>
              Add to Cart
            </button>
          </div>
          <hr className="bg-grey mt-5" />
          <div className="flex gap-3 items-center">
            <img src={`${StockIcon}`} />
            <p>
              More than{" "}
              <span className="font-bold">
                {product.variants[0].stockLocations[0].stock}
              </span>{" "}
              in stock
            </p>
            <div className="w-2.5 h-2.5 rounded-full bg-green"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Variant: React.FC<{ variant: any }> = ({ variant }) => {
  const { basket, addToBasket } = useLocalBasket();

  return (
    <div>
      <h2>{variant.name}</h2>${variant.price}
      <p>Sku: {variant.sku}</p>
      <button
        onClick={() => {
          addToBasket(variant);
        }}
      >
        Add to cart
      </button>
    </div>
  );
};
function addToCart(variant: any) {
    throw new Error("Function not implemented.");
}

function useLocalCart(): { add: any; } {
    throw new Error("Function not implemented.");
}

