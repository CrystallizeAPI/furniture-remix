import { useState } from 'react';
import { useLocalCart } from '../hooks/useLocalCart';
import { useAppContext } from '../app-context/provider';
import { ProductVariant } from '../../use-cases/contracts/ProductVariant';
import { ServiceAPI } from '../../use-cases/service-api';

export type VariantPack = VariantPackItem[];

export type VariantPackItem = {
    variant: ProductVariant;
    quantity: number;
    key?: string; // a pack can have multiple items with the same variant...
};

export const AddToCartBtn: React.FC<{
    pack: VariantPack;
    label?: string;
}> = ({ pack, label = 'addToCart' }) => {
    const { state } = useAppContext();
    const [showTada, setShowTada] = useState(false);
    const { dispatch: contextDispatch, _t } = useAppContext();
    const { add } = useLocalCart();

    const handleClick = () => {
        setShowTada(true);
        contextDispatch.addItemsToCart(pack.map((packitem: VariantPackItem) => packitem.variant));

        pack.forEach((packitem: VariantPackItem) => {
            add(
                {
                    name: packitem.variant.name,
                    sku: packitem.variant.sku,
                    price:
                        packitem.variant.priceVariants.default.priceFor.price <
                        packitem.variant.priceVariants.default.value
                            ? packitem.variant.priceVariants.default.priceFor.price
                            : packitem.variant.priceVariants.default.value,
                },
                packitem.quantity,
            );
        });
        setTimeout(() => {
            setShowTada(false);
        }, 1500);
    };

    let defaultStock = pack.reduce((memo: number, packitem: VariantPackItem) => {
        const defaultStockLocation = packitem.variant?.stockLocations?.default;
        return memo + (defaultStockLocation?.stock || 0);
    }, 0);

    return (
        <>
            <button
                data-testid="add-to-cart-button"
                className="bg-[#000] border px-10 py-3 relative overflow-hidden h-[50px] rounded-md text-[#fff] w-[200px] font-bold hover:bg-black-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                    handleClick();
                }}
                disabled={defaultStock < 1}
            >
                <span
                    className={`w-[200] transition-all left-0 top-0 h-full w-full flex items-center justify-center absolute
                    ${showTada ? 'scale-0' : 'scale-100'}`}
                >
                    {_t(label)}
                </span>
                <span
                    className={`w-[200] text-3xl transition-all	left-0 top-0 h-full w-full flex items-center justify-center absolute ${
                        showTada ? 'scale-100' : 'scale-0'
                    }`}
                >
                    🎉
                </span>
            </button>
            {state.paymentImplementations.includes('vipps') && (
                <>
                    <button
                        className="bg-[#FF5B25] border px-10 py-3 relative overflow-hidden h-[50px] rounded-md text-[#fff] w-[200px] font-bold hover:bg-black-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={async () => {
                            const response = await ServiceAPI({
                                language: state.language,
                                serviceApiUrl: state.serviceApiUrl,
                            }).vipps.initiateExpressCheckoutPaymentIntent(
                                pack.map((packitem: VariantPackItem) => {
                                    return {
                                        sku: packitem.variant.sku,
                                        quantity: packitem.quantity,
                                    };
                                }),
                            );
                            window.location.href = response.url || response.redirectUrl;
                        }}
                        disabled={defaultStock < 1}
                    >
                        Buy now
                    </button>
                </>
            )}
        </>
    );
};
