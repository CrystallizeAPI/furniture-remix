import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { VariantSelector } from '~/core/components/variant-selector';
import { ProductBody } from '~/core/components/product-body';
import { Cart } from '~/core/components/cart';
import { ImageGallery } from '~/core/components/image-gallery';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { TopicLabels } from '~/core/components/topic-labels';
import { Price } from '~/core/components/price';
import { StockLocations } from '~/core/components/stock-location';
import { Product } from '~/core/components/item/product';
import { buildMetas } from '~/core/MicrodataBuilder';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/shop/${params.folder}/${params.product}`;
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    const product = await CrystallizeAPI.fetchProduct(secret.apiClient, path, version);
    return json({ product }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default () => {
    const { product } = useLoaderData();
    const primaryVariant = product.variants.find((v: any) => v.isDefault);
    let [selectedVariant, setSelectedVariant] = useState(primaryVariant);
    let [showCart, setShowCart] = useState(false);
    let location = useLocation();

    let title = product?.components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = product?.components?.find((component: any) => component.type === 'richText')?.content?.plainText;

    const { add } = useLocalCart();

    const onVariantChange = (variant: any) => setSelectedVariant(variant);

    const handleClick = () => {
        add(selectedVariant);
        setShowCart(true);
    };
    let relatedProducts = product?.components?.find((component: any) => component.id === 'related-items')?.content
        ?.items;

    useEffect(() => {
        setSelectedVariant(primaryVariant);
    }, [location.pathname]);

    return (
        <div className="p-8 px-20 mx-auto">
            {showCart ? <Cart /> : null}
            <div className="flex gap-20 lg:flex-row flex-col-reverse">
                <div className="lg:w-4/6 w-full img-container">
                    <div className="img-container overflow-hidden rounded-md">
                        <ImageGallery images={selectedVariant?.images} />
                    </div>
                    <ProductBody components={product?.components} />
                </div>
                <div className="lg:w-2/6 w-full">
                    <div className="flex flex-col gap-4 sticky top-8">
                        {product.topics && <TopicLabels labels={product?.topics} />}
                        <h1 className="font-bold text-4xl">{title}</h1>
                        <p className="text-xl font-normal">{description}</p>
                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onVariantChange={onVariantChange}
                            renderingType="default"
                        />
                        {selectedVariant && (
                            <div className="flex justify-between items-end">
                                <Price variant={selectedVariant} />
                                <button
                                    className="bg-[#000] px-10 py-3 rounded text-[#fff] font-bold hover:bg-black-100"
                                    onClick={() => {
                                        handleClick();
                                    }}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        )}

                        <div className="bg-[#dfdfdf] h-[1px] mt-5" />
                        <StockLocations locations={selectedVariant?.stockLocations} />
                    </div>
                </div>
            </div>
            {relatedProducts && (
                <div className="w-full">
                    <h3 className="font-bold mt-20 mb-10 text-xl">You might also be interested in</h3>
                    <div className="gap-5 lg:grid grid-cols-5 pb-5 flex flex-wrap">
                        {relatedProducts?.map((item: any, index: number) => (
                            <Product item={item} key={`${item?.id}-${index}`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
