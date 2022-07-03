import { Image } from '@crystallize/reactjs-components';
import { useState, useEffect } from 'react';
import { useLocation } from '@remix-run/react';
import { Price } from '~/core/components/price';
import { VariantSelector } from '~/core/components/variant-selector';

export function CuratedProduct({ merch, current }: { merch: any; current: any }) {
    return (
        <>
            {merch.products?.map((product: any, productIndex: number) => (
                <Product product={product} current={current} key={productIndex} />
            ))}
        </>
    );
}

const Product = ({ product, current }: { product: any; current: any }) => {
    const primaryVariant = product.variants.find((v: any) => v.isDefault);
    let [selectedVariant, setSelectedVariant] = useState(primaryVariant);
    let location = useLocation();

    const onVariantChange = (variant: any) => {
        current.setVariants((prevState: any) => {
            const indexOfVariant = prevState.findIndex((a: any) => a.id === selectedVariant.id);
            if (indexOfVariant > -1) {
                let newArr = [...prevState];
                newArr[indexOfVariant] = { ...variant };
                return newArr;
            }
            return [...prevState, variant];
        });

        setSelectedVariant(variant);
    };

    useEffect(() => {
        current.setVariants((prevState: any) => [...prevState, primaryVariant]);
    }, [location.pathname]);

    return (
        <>
            <div className="flex gap-2 justify-between flex-wrap items-center py-2">
                <div className="flex items-center w-8/12">
                    <div className="w-[60px] h-[80px] img-container img-cover">
                        <Image sizes="200px" {...selectedVariant?.images?.[0]} />
                    </div>
                    <div className="pl-4 pb-2">
                        {selectedVariant.name}
                        <Price variant={selectedVariant} size="small" />
                    </div>
                </div>
                <div className="flex gap-2">
                    <VariantSelector
                        variants={product.variants}
                        selectedVariant={selectedVariant}
                        onVariantChange={onVariantChange}
                        renderingType="dropdown"
                    />
                </div>
            </div>
        </>
    );
};
