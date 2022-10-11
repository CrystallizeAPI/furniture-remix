import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { CuratedProductItem } from '~/core/components/curated-product';
import { useMemo, useState } from 'react';
import { AddToCartBtn, VariantPack, VariantPackItem } from '~/core/components/add-to-cart-button';
import { Price } from '~/lib/pricing/pricing-component';
import { useAppContext } from '~/core/app-context/provider';
import { Product } from '@crystallize/js-api-client';
import { ProductBody } from '~/core/components/product-body';
import { fetchData as abstractStoryFetchData } from './AbstractStory';

export type CuratedStory = any;

export const fetchData = async (path: string, request: any, params: any): Promise<CuratedStory> => {
    return abstractStoryFetchData(path, request, params);
};

const getComponentContent = (components: any, id: string) => {
    const component = components.find((component: any) => component.id === id);
    return component?.content || null;
};

export default ({ data: story }: { data: CuratedStory }) => {
    const [activePoint, setActivePoint] = useState('');
    const { state: appContextState } = useAppContext();
    const title = getComponentContent(story?.components, 'title')?.text;
    const description = getComponentContent(story?.components, 'description')?.json;
    const shoppableImage = getComponentContent(story?.components, 'shoppable-image')?.images?.[0];
    const merchandising = getComponentContent(story?.components, 'merchandising')?.chunks?.map((merch: any) => {
        return {
            products: getComponentContent(merch, 'products')?.items,
            hotspotX: getComponentContent(merch, 'hotspot-x'),
            hotspotY: getComponentContent(merch, 'hotspot-y'),
        };
    });

    // construct the defaut pack from merch.products with quanity 1
    const defaultPack = useMemo(
        () =>
            merchandising?.reduce((memo: VariantPack, merch: any, merchIndex: number) => {
                merch.products.forEach((product: Product, productIndex: number) => {
                    if (!product.variants) {
                        return;
                    }
                    const primaryVariant = product.variants.find((v: any) => v.isDefault);
                    memo.push({
                        variant: primaryVariant || product.variants[0],
                        quantity: 1,
                        key: `${merchIndex}-${productIndex}`,
                    });
                });
                return memo;
            }, []),
        [merchandising],
    );

    const [pack, setPack] = useState<VariantPack>(defaultPack);
    const totalAmountToPay = pack.reduce((memo: number, packitem: VariantPackItem) => {
        const price =
            packitem.variant.priceVariants?.find((price: any) => price.identifier === 'sales')?.price ||
            packitem.variant.price;
        return memo + (price || 0) * packitem.quantity;
    }, 0);

    const updatePack = (previous: VariantPackItem, next: VariantPackItem) => {
        setPack(
            pack.map((packitem: VariantPackItem) => {
                if (previous.key === packitem.key) {
                    // we got to preserve the key
                    return {
                        ...packitem,
                        quantity: next.quantity,
                        variant: next.variant,
                    };
                }
                return packitem;
            }),
        );
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-8 min-h-full container px-6 mx-auto mt-20 mb-40">
            <div className="lg:w-7/12">
                <div className="img-container overflow-hidden self-start rounded-lg relative">
                    <div className="absolute h-full w-full frntr-hotspot frntr-hotspot-microformat">
                        {merchandising.map((merch: any, i: number) => (
                            <span
                                onMouseOver={() => setActivePoint(`hotspot-point-${i}`)}
                                onMouseLeave={() => setActivePoint('')}
                                key={`hotspot-${merch?.hotspotX?.number}-${merch?.hotspotY?.number}`}
                                style={{ left: merch?.hotspotX?.number + `%`, top: merch?.hotspotY?.number + '%' }}
                            >
                                <div className="rounded-sm overflow-hidden shadow-sm px-2 pt-2 ">
                                    {merch.products?.map((product: any) => (
                                        <div className="flex items-center gap-2 pb-2" key={product.id}>
                                            <div className="img-container img-cover w-[30px] h-[40px]">
                                                <Image
                                                    {...product?.defaultVariant?.firstImage}
                                                    sizes="100px"
                                                    loading="lazy"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs">{product.name}</div>
                                                <div className="text-xs font-bold">
                                                    {appContextState.currency.code} {product.defaultVariant.price}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </span>
                        ))}
                    </div>
                    <Image {...shoppableImage} sizes="50vw" />
                </div>
                <ProductBody components={story?.components} />
            </div>

            <div className="px-6 lg:w-5/12">
                <h1 className="text-3xl font-semibold mb-2">{title}</h1>
                <div className="border-b pb-4 mb-4 border-[#dfdfdf] text-1xl leading-[1.4em] mb-5">
                    <ContentTransformer json={description} />
                </div>
                <div className="sticky top-20">
                    {merchandising.map((merch: any, merchIndex: number) => (
                        <div
                            key={`merch-container-${merch?.hotspotX?.number}-${merch?.hotspotY?.number}`}
                            className="px-2 overflow-hidden rounded-md my-2"
                            style={{
                                border:
                                    activePoint === `hotspot-point-${merchIndex}`
                                        ? '1px solid #000'
                                        : '1px solid transparent',
                            }}
                        >
                            <CuratedProductItem
                                merch={merch}
                                updatePack={updatePack}
                                pack={pack}
                                merchIndex={merchIndex}
                            />
                        </div>
                    ))}
                    <div className="flex pt-5 mt-5 items-center justify-between">
                        <div className="text-2xl font-bold text-green2">
                            <Price currencyCode={appContextState.currency.code}>{totalAmountToPay}</Price>
                        </div>
                        <AddToCartBtn pack={pack} />
                    </div>
                </div>
            </div>
        </div>
    );
};
