import { useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { Cart } from '~/core/components/cart';

export const AddToCartBtn = ({ products, label = 'Add to cart' }: { products: any; label?: string }) => {
    const [showTada, setShowTada] = useState(false);

    const { add } = useLocalCart();

    const handleClick = () => {
        setShowTada(true);
        if (Array.isArray(products)) {
            console.log('is Array');
            for (let i = 0; i < products.length; i++) {
                add(products[i]);
            }
        } else {
            add(products);
        }
        setTimeout(() => {
            setShowTada(false);
        }, 1500);
    };

    return (
        <>
            {showTada && <Cart />}
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
