import { ProductVariant } from '@crystallize/js-api-client';
import { useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useAppContext } from '../app-context/provider';

export type VariantPack = VariantPackItem[];

export type VariantPackItem = {
    variant: ProductVariant;
    quantity: number;
    key?: string; // a pack can have multiple items with the same variant...
};

export const AddToCartBtn: React.FC<{
    pack: VariantPack;
    label?: string;
}> = ({ pack, label = 'Add to cart' }) => {
    const [showTada, setShowTada] = useState(false);
    const { dispatch: contextDispatch } = useAppContext();
    const { add } = useLocalCart();

    const handleClick = () => {
        setShowTada(true);
        contextDispatch.addItemsToCart(pack.map((packitem: VariantPackItem) => packitem.variant));

        pack.forEach((packitem: VariantPackItem) => {
            add(packitem.variant, packitem.quantity);
        });
        setTimeout(() => {
            setShowTada(false);
        }, 1500);
    };

    return (
        <>
            <button
                className="bg-[#000] border px-10 py-3 relative overflow-hidden h-[50px] rounded text-[#fff] w-[200px] font-bold hover:bg-black-100"
                onClick={() => {
                    handleClick();
                }}
            >
                <span
                    className={`w-[200] transition-all left-0 top-0 h-full w-full flex items-center justify-center absolute
                    ${showTada ? 'scale-0' : 'scale-100'}`}
                >
                    {label}
                </span>
                <span
                    className={`w-[200] text-3xl transition-all	left-0 top-0 h-full w-full flex items-center justify-center absolute ${
                        showTada ? 'scale-100' : 'scale-0'
                    }`}
                >
                    🎉
                </span>
            </button>
        </>
    );
};
