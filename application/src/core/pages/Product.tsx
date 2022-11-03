import { useLocation } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { RequestContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { useAppContext } from '../app-context/provider';
import { AddToCartBtn } from '../components/add-to-cart-button';
import { ImageGallery } from '../components/image-gallery';
import { Product } from '../components/item/product';
import type { Product as ProductType } from '~/core/contracts/Product';
import { Price } from '../components/price';
import { ProductBody } from '../components/product-body';
import { StockLocations } from '../components/stock-location';
import { TopicLabels } from '../components/topic-labels';
import { VariantSelector } from '../components/variant-selector';
import { buildSchemaMarkup } from '../SchemaMarkupBuilder';
import { ProductVariant } from '../contracts/ProductVariant';

export const fetchData = async (path: string, request: RequestContext, params: any): Promise<ProductType> => {
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

export default ({ data: product }: { data: ProductType }) => {
    const location = useLocation();
    const { _t } = useAppContext();
    const primaryVariant =
        product.variants.find((v: any) => v.sku === location.hash.replace('#', '')) ?? product.defaultVariant;
    let [selectedVariant, setSelectedVariant] = useState(primaryVariant);

    const onVariantChange = (variant: ProductVariant) => {
        window.location.hash = variant.sku;
        setSelectedVariant(variant);
    };

    let description = selectedVariant.description || product.description;

    useEffect(() => {
        setSelectedVariant(primaryVariant);
    }, [product]);

    console.log(product.relatedItems);
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
                            <ImageGallery images={selectedVariant.images} />
                        </div>
                        <ProductBody
                            story={product?.story}
                            propertiesTable={product?.specifications}
                            dimensions={product?.dimensions}
                            downloads={product?.downloads}
                        />
                    </div>
                    <div className="lg:w-2/6 w-full">
                        <div className="flex flex-col gap-2 sticky top-16 pb-10">
                            <div className="mb-2">{product.topics && <TopicLabels topics={product.topics} />}</div>
                            <div className="pr-6 md:pr-6">
                                <h1 className="font-bold text-4xl mb-2">{product.title}</h1>
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
                                    <AddToCartBtn pack={[{ variant: selectedVariant, quantity: 1 }]} />
                                </div>
                            )}
                            <div className="bg-[#dfdfdf] h-[1px] mt-5" />
                            <StockLocations locations={Object.values(selectedVariant.stockLocations)} />
                        </div>
                    </div>
                </div>

                {product.relatedItems && (
                    <div className="w-full border-t border-[#dfdfdf] pr-6 sm:pr-0">
                        <h2 className="font-bold mt-20 mb-4 text-xl">{_t('relatedProducts')}</h2>
                        <div className="grid gap-5 grid-cols-2 grid md:grid-cols-4 lg:grid-cols-5 pb-5">
                            {product.relatedItems.map((item, index) => (
                                <Product item={item} key={`${item.path}-${index}`} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
