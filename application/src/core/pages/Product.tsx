import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { RequestContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { useAppContext } from '../app-context/provider';
import { AddToCartBtn } from '../components/add-to-cart-button';
import { ImageGallery } from '../components/image-gallery';
import { Product } from '../components/item/product';
import { Price } from '../components/price';
import { ProductBody } from '../components/product-body';
import { StockLocations } from '../components/stock-location';
import { TopicLabels } from '../components/topic-labels';
import { VariantSelector } from '../components/variant-selector';
import { buildSchemaMarkup } from '../SchemaMarkupBuilder';

export type Product = any;

export const fetchData = async (path: string, request: RequestContext, params: any): Promise<Product> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    const product = await api.fetchProduct(path);
    if (!product) {
        throw new Response('Product Not Found', {
            status: 404,
            statusText: 'Product Not Found',
        });
    }
    return product;
};

export default ({ data: product }: { data: Product }) => {
    const location = useLocation();
    const { _t } = useAppContext();
    const primaryVariant =
        product.variants.find((v: any) => v.sku === location.hash.replace('#', '')) ??
        product.variants.find((v: any) => v.isDefault) ??
        product.variants[0];
    let [selectedVariant, setSelectedVariant] = useState(primaryVariant);
    const title =
        product?.components?.find((component: any) => component.id === 'title')?.content?.text || product.name;

    const onVariantChange = (variant: any) => {
        window.location.hash = variant.sku;
        setSelectedVariant(variant);
    };
    const relatedProducts = product?.components?.find((component: any) => component.id === 'related-items')?.content
        ?.items;

    let description = product?.components?.find((component: any) => component.type === 'richText')?.content?.plainText;
    const selectedVariantDescription = selectedVariant?.description?.content?.selectedComponent?.content?.plainText;
    const selectedVariantDescriptionType = selectedVariant?.description?.content?.selectedComponent?.id;

    if (selectedVariantDescriptionType) {
        description =
            selectedVariantDescriptionType === 'extra'
                ? description + ' ' + selectedVariantDescription
                : selectedVariantDescription;
    }

    useEffect(() => {
        setSelectedVariant(primaryVariant);
    }, [product]);
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildSchemaMarkup(product)),
                }}
            />
            <div className="pl-6 md:px-6 mx-auto xl:container full">
                <div className="flex gap-20 lg:flex-row flex-col-reverse ">
                    <div className="lg:w-4/6 w-full pr-6 md:pr-6">
                        <div className="img-container overflow-hidden rounded-md">
                            <ImageGallery images={selectedVariant?.images} />
                        </div>
                        <ProductBody components={product?.components} />
                    </div>
                    <div className="lg:w-2/6 w-full">
                        <div className="flex flex-col gap-2 sticky top-16 pb-10">
                            <div className="mb-2">{product.topics && <TopicLabels labels={product?.topics} />}</div>
                            <div className="pr-6 md:pr-6">
                                <h1 className="font-bold text-4xl mb-2">{title}</h1>
                                <p className="text-md font-normal">{description}</p>
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
                                    <AddToCartBtn
                                        pack={[{ variant: selectedVariant, quantity: 1 }]}
                                        stockLocations={selectedVariant?.stockLocations}
                                    />
                                </div>
                            )}
                            <div className="bg-[#dfdfdf] h-[1px] mt-5" />
                            <StockLocations locations={selectedVariant?.stockLocations} />
                        </div>
                    </div>
                </div>

                {relatedProducts && (
                    <div className="w-full border-t border-[#dfdfdf] pr-6 sm:pr-0">
                        <h2 className="font-bold mt-20 mb-4 text-xl">{_t('relatedProducts')}</h2>
                        <div className="grid gap-5 grid-cols-2 grid md:grid-cols-4 lg:grid-cols-5 pb-5">
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
