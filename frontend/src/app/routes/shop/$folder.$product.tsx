import { HttpCacheHeaderTaggerFromLoader, SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Image } from '@crystallize/reactjs-components/dist/image';
import StockIcon from '~/assets/stockIcon.svg';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { fetchProduct } from '~/core/UseCases';
import { useState } from 'react';
import { VariantSelector } from '~/core/components/variant-selector';
import { ProductBody } from '~/core/components/product-body';
import { Cart } from '~/core/components/cart';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/shop/${params.folder}/${params.product}`;
    const superFast = await getSuperFast(request.headers.get('Host')!);
    const product = await fetchProduct(superFast.apiClient, path, version);
    return json({ product }, SuperFastHttpCacheHeaderTagger('30s', '30s', [path], superFast.config));
};

export default function ProductPage() {
    const { product } = useLoaderData();
    let [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    let [showCart, setShowCart] = useState(false);

    let title = product.components.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = product.components.find((component: any) => component.type === 'richText')?.content?.plainText;

    const { add } = useLocalCart();

    const onVariantChange = (variant: any) => setSelectedVariant(variant);

    const handleClick = () => {
        add(selectedVariant);
        setShowCart(true);
    };

    return (
        <div className="lg:w-content mx-auto w-full">
            {showCart ? <Cart /> : null}
            <div className="flex gap-10">
                <div className="w-2/4">
                    <Image {...selectedVariant.images[0]} />
                </div>
                <div className="w-2/4 flex flex-col gap-5 mt-5">
                    <h1 className="font-bold text-4xl">{title}</h1>
                    <p>{description}</p>
                    <VariantSelector
                        variants={product.variants}
                        selectedVariant={selectedVariant}
                        onVariantChange={onVariantChange}
                    />
                    <div className="flex justify-between items-center">
                        <p className="font-bold">${selectedVariant.price}</p>
                        <button
                            className="bg-buttonBg2 px-10 py-3 rounded font-buttonText"
                            onClick={() => {
                                handleClick();
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>

                    <hr className="bg-grey mt-5" />
                    <div className="flex gap-3 items-center">
                        <img src={`${StockIcon}`} />
                        <p>
                            More than <span className="font-bold">{product.variants[0].stockLocations[0].stock}</span>{' '}
                            in stock
                        </p>
                        <div className="w-2.5 h-2.5 rounded-full bg-green"></div>
                    </div>
                </div>
            </div>
            <ProductBody components={product.components} />
        </div>
    );
}
