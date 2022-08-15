import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { CuratedProduct } from '~/core/components/curated-product';
import { useState } from 'react';
import { AddToCartBtn } from '~/core/components/add-to-cart-button';
import { Price } from '~/lib/pricing/pricing-component';
import { useAppContext } from '~/core/app-context/provider';

const getComponentContent = (components: any, id: string) => {
    let component = components.find((component: any) => component.id === id);
    return component?.content || null;
};

export function CuratedProductStory({ document }: { document: any }) {
    const [activePoint, setActivePoint] = useState('');
    let [variants, setVariants] = useState([]);
    const { state: appContextState } = useAppContext();

    let title = getComponentContent(document?.components, 'title')?.text;
    let description = getComponentContent(document?.components, 'description')?.json;
    let shoppableImage = getComponentContent(document?.components, 'shoppable-image')?.images?.[0];
    let merchandising = getComponentContent(document?.components, 'merchandising')?.chunks?.map((merch: any) => {
        return {
            products: getComponentContent(merch, 'products')?.items,
            hotspotX: getComponentContent(merch, 'hotspot-x'),
            hotspotY: getComponentContent(merch, 'hotspot-y'),
        };
    });

    let totalAmountToPay = 0;
    variants.map((v: any) => {
        const price = v.priceVariants?.find((price: any) => price.identifier === 'sales')?.price || v.price;
        totalAmountToPay += price;
    });

    return (
        <div className="2xl grid lg:grid-cols-5 gap-8 min-h-full container px-6 mx-auto mt-20 mb-40">
            <div className="img-container lg:col-span-3 overflow-hidden self-start rounded-lg relative">
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
            <div className="px-6 lg:col-span-2">
                <h1 className="text-4xl font-semibold mb-2">{title}</h1>
                <div className="lg:w-3/4 text-1xl leading-[1.4em] mb-5">
                    <ContentTransformer json={description} />
                </div>
                <div className="sticky top-20">
                    {merchandising.map((merch: any, i: number) => (
                        <div
                            key={`merch-container-${merch?.hotspotX?.number}-${merch?.hotspotY?.number}`}
                            className="px-2 bg-grey overflow-hidden rounded-md my-2"
                            style={{
                                border:
                                    activePoint === `hotspot-point-${i}` ? '1px solid #000' : '1px solid transparent',
                            }}
                        >
                            <CuratedProduct merch={merch} current={{ variants, setVariants }} />
                        </div>
                    ))}
                    <div className="flex pt-5 mt-5 border-solid border-t-[1px] border-[#dfdfdf] items-center justify-between">
                        <div className="text-2xl font-bold text-green2">
                            <Price currencyCode={appContextState.currency.code}>{totalAmountToPay}</Price>
                        </div>
                        <AddToCartBtn products={variants} label={`Add ${variants?.length} to cart`} />
                    </div>
                </div>
            </div>
        </div>
    );
}
