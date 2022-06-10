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

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }: { data: any }) => {
    let metaData = data?.product?.meta?.content?.chunks?.[0];
    let title = metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    let description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText;
    let image = metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;

    return {
        title,
        'og:title': title,
        description,
        'og:description': description,
        'og:image':image,
        'twitter:image': image,
        'twitter:card': 'summary_large_image',
        'twitter:description': description,
        'og:type': 'product',
    };
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

export default function ProductPage() {
    const { product } = useLoaderData();
    let metaData = product?.meta?.content?.chunks?.[0];
    console.log({metaData})
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
        <div className="container p-8 px-202xl mx-auto w-full ">
            {showCart ? <Cart /> : null}
            <div className="flex gap-20">
                <div className="w-4/6 img-container">
                    <div className="img-container overflow-hidden rounded-md">
                        <ImageGallery images={selectedVariant?.images} />
                    </div>
                    <ProductBody components={product?.components} />
                </div>
                <div className="w-2/6">
                    <div className="flex flex-col gap-5 sticky top-8">
                        <h1 className="font-bold text-4xl">{title}</h1>
                        {product.topics && <TopicLabels labels={product?.topics} />}
                        <p className="text-xl font-normal">{description}</p>
                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onVariantChange={onVariantChange}
                        />
                        <div className="flex justify-between items-center">
                            <Price priceVariants={selectedVariant.priceVariants} />
                            <button
                                className="bg-buttonBg2 px-10 py-3 rounded font-buttonText font-bold hover:bg-pink"
                                onClick={() => {
                                    handleClick();
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>

                        <hr className="bg-[#dfdfdf] mt-5" />
                        <StockLocations locations={selectedVariant?.stockLocations} />
                    </div>
                </div>
            </div>
            {relatedProducts && (
                <div className="w-full">
                    <h3 className="font-bold mt-20 mb-10 text-xl">You might also be interested in</h3>
                    <div className="gap-5 grid grid-cols-5 pb-5">
                        {relatedProducts?.map((item: any, index: number) => (
                            <Product item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
