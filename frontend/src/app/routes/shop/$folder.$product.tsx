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
    let description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText?.[0];
    let image = metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;
    let altDescription = data?.product?.components?.find((comp: any) => comp.id === 'description')?.content
        ?.plainText?.[0];
    let altImage = data?.product?.variants?.[0]?.images?.[0]?.url;

    return {
        title: title || data?.product?.name,
        'og:title': title ? title : data.product.name,
        description: description || altDescription,
        'og:description': description || altDescription,
        'og:image': image || altImage,
        'twitter:image': image || altImage,
        'twitter:card': 'summary_large_image',
        'twitter:description': description || altDescription,
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
        <div className="container p-8 px-202xl mx-auto">
            {showCart ? <Cart /> : null}
            <div className="flex gap-20 xl:flex-row flex-col-reverse">
                <div className="xl:w-4/6 w-full img-container">
                    <div className="img-container overflow-hidden rounded-md">
                        <ImageGallery images={selectedVariant?.images} />
                    </div>
                    <ProductBody components={product?.components} />
                </div>
                <div className="xl:w-2/6 w-full">
                    <div className="flex flex-col gap-4 sticky top-8">
                        {product.topics && <TopicLabels labels={product?.topics} />}
                        <h1 className="font-bold text-4xl">{title}</h1>
                        <p className="text-xl font-normal">{description}</p>
                        <VariantSelector
                            variants={product.variants}
                            selectedVariant={selectedVariant}
                            onVariantChange={onVariantChange}
                        />
                        <div className="flex justify-between items-end">
                            <Price priceVariants={selectedVariant.priceVariants} />
                            <button
                                className="bg-[#000] px-10 py-3 rounded text-[#fff] font-bold hover:bg-black-100"
                                onClick={() => {
                                    handleClick();
                                }}
                            >
                                Add to Cart
                            </button>
                        </div>

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
                            <Product item={item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
