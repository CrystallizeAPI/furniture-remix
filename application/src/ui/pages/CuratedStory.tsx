'use client';

import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { CuratedProductItem } from '../components/curated-product-item';
import { useMemo, useState } from 'react';
import { AddToCartBtn, VariantPack, VariantPackItem } from '../components/add-to-cart-button';
import { useAppContext } from '../app-context/provider';
import { CuratedStory } from '../../use-cases/contracts/Story';
import { ParagraphCollection } from '../components/crystallize-components/paragraph-collection';
import { Price } from '../lib/pricing/pricing-component';

export default ({ data: story }: { data: CuratedStory }) => {
    const [activePoint, setActivePoint] = useState('');
    const { state: appContextState } = useAppContext();
    // construct the defaut pack from merch.products with quanity 1
    const defaultPack = useMemo(
        () =>
            story.merchandising.reduce((memo: VariantPack, merch, merchIndex) => {
                merch.products.forEach((product, productIndex) => {
                    memo.push({
                        variant: product.variant,
                        quantity: 1,
                        key: `${merchIndex}-${productIndex}`,
                    });
                });
                return memo;
            }, []),
        [story.merchandising],
    );

    const [pack, setPack] = useState<VariantPack>(defaultPack);
    const totalAmountToPay = pack.reduce((memo: number, packitem: VariantPackItem) => {
        const marketPrice = packitem.variant.priceVariants?.default?.priceFor?.price;
        const price = packitem.variant.priceVariants?.sales?.value || packitem.variant.priceVariants?.default?.value;

        const priceToUse = marketPrice < price ? marketPrice : price;
        return memo + (priceToUse || 0) * packitem.quantity;
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
                        {story.merchandising.map((merch, i) => (
                            <span
                                onMouseOver={() => setActivePoint(`hotspot-point-${i}`)}
                                onMouseLeave={() => setActivePoint('')}
                                key={`hotspot-${merch.x}-${merch.y}`}
                                style={{ left: merch.x + `%`, top: merch.y + '%' }}
                            >
                                <div className="rounded-sm overflow-hidden shadow-sm px-2 pt-2 ">
                                    {merch.products.map((product, index) => (
                                        <div className="flex items-center gap-2 pb-2" key={index}>
                                            <div className="img-container img-cover w-[30px] h-[40px]">
                                                <Image
                                                    {...product.variant.images?.[0]}
                                                    sizes="100px"
                                                    loading="lazy"
                                                    fallbackAlt={product.name}
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs">{product.name}</div>
                                                <div className="text-xs font-bold">
                                                    {appContextState.currency.code}{' '}
                                                    {product.variant.priceVariants.default.value}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </span>
                        ))}
                    </div>
                    <Image {...story?.medias?.images?.[0]} sizes="50vw" fallbackAlt={story.title} />
                </div>
                <div className="max-w-[1000px] ">{story.story && <ParagraphCollection paragraphs={story.story} />}</div>
            </div>

            <div className="px-6 lg:w-5/12">
                <h1 className="text-3xl font-semibold mb-2">{story.title}</h1>
                <div className="border-b pb-4 mb-4 border-[#dfdfdf] text-1xl leading-[1.4em] mb-5">
                    <ContentTransformer json={story.description?.json} />
                </div>
                <div className="sticky top-20">
                    {story.merchandising.map((merch, merchIndex) => {
                        return (
                            <div
                                key={`merch-container-${merch.x}-${merch.y}`}
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
                        );
                    })}
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
