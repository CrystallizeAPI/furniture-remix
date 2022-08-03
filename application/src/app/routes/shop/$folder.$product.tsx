import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData, useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { VariantSelector } from '~/core/components/variant-selector';
import { ProductBody } from '~/core/components/product-body';
import { ImageGallery } from '~/core/components/image-gallery';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { TopicLabels } from '~/core/components/topic-labels';
import { Price } from '~/core/components/price';
import { StockLocations } from '~/core/components/stock-location';
import { Product } from '~/core/components/item/product';
import { buildMetas } from '~/core/MicrodataBuilder';
import { AddToCartBtn } from '~/core/components/add-to-cart-button';
import { buildSchemaMarkup } from '~/core/SchemaMarkupBuilder';
import { getHost } from '~/core-server/http-utils.server';

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
    const { shared, secret } = await getStoreFront(getHost(request));

    const product = await CrystallizeAPI.fetchProduct(secret.apiClient, path, version, 'en');
    if (!product) {
        throw new Response('Product Not Found', {
            status: 404,
            statusText: 'Product Not Found',
        });
    }
    return json({ product }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default () => {
    const { product } = useLoaderData();
    const primaryVariant = product.variants.find((v: any) => v.isDefault);
    let [selectedVariant, setSelectedVariant] = useState(primaryVariant);
    let location = useLocation();
    let title =
        product?.components?.find((component: any) => component.type === 'singleLine')?.content?.text || product.name;
    let description = product?.components?.find((component: any) => component.type === 'richText')?.content?.plainText;
    const onVariantChange = (variant: any) => setSelectedVariant(variant);

    let relatedProducts = product?.components?.find((component: any) => component.id === 'related-items')?.content
        ?.items;

    useEffect(() => {
        setSelectedVariant(primaryVariant);
    }, [location.pathname]);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildSchemaMarkup(product)),
                }}
            />
            <div className="pl-6 md:px-6 mx-auto xl:container full">
                {/* {showCart ? <Cart /> : null} */}
                <div className="flex gap-20 lg:flex-row flex-col-reverse ">
                    <div className="lg:w-4/6 w-full img-container pr-6 md:pr-6">
                        <div className="img-container overflow-hidden rounded-md">
                            <ImageGallery images={selectedVariant?.images} />
                        </div>
                        <ProductBody components={product?.components} />
                    </div>
                    <div className="lg:w-2/6 w-full">
                        <div className="flex flex-col gap-4 sticky top-8">
                            <div className="mb-2">{product.topics && <TopicLabels labels={product?.topics} />}</div>
                            <div className="pr-6 md:pr-6">
                                <h1 className="font-bold text-4xl mb-2">{title}</h1>
                                <p className="text-xl font-normal">{description}</p>
                            </div>
                            <VariantSelector
                                variants={product.variants}
                                selectedVariant={selectedVariant}
                                onVariantChange={onVariantChange}
                                renderingType="default"
                            />
                            {selectedVariant && (
                                <div className="flex justify-between md:items-end sm:flex-row flex-col  sm:gap-1 gap-4">
                                    <Price variant={selectedVariant} />
                                    <AddToCartBtn products={selectedVariant} />
                                </div>
                            )}

                            <div className="bg-[#dfdfdf] h-[1px] mt-5" />
                            <div className="pr-6 md:pr-6">
                                <StockLocations locations={selectedVariant?.stockLocations} />
                            </div>
                        </div>
                    </div>
                </div>
                {relatedProducts && (
                    <div className="w-full">
                        <h3 className="font-bold mt-20 mb-10 text-xl">You might also be interested in</h3>
                        <div className="gap-5 grid-col-2 lg:grid grid-cols-5 pb-5 flex flex-wrap">
                            {relatedProducts?.map((item: any, index: number) => (
                                <Product item={item} key={`${item?.id}-${index}`} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
