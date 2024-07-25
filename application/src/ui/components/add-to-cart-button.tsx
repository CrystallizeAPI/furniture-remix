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
    const [showLoader, setShowLoader] = useState(false);
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
                    image: packitem.variant.images?.[0]?.url || '',
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
        <div className="flex gap-1 mt-4 flex-col sm:flex-row">
            <button
                data-testid="add-to-cart-button"
                className="bg-[#000] border px-5 py-3 relative overflow-hidden h-[50px] rounded-md text-[#fff] sm:w-[180px] w-full font-bold hover:bg-black-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                    handleClick();
                }}
                disabled={defaultStock < 1}
            >
                <span
                    className={`transition-all left-0 top-0 h-full w-full flex items-center justify-center absolute
                    ${showTada ? 'scale-0' : 'scale-100'}`}
                >
                    {_t(label)}
                </span>
                <span
                    className={`text-3xl transition-all left-0 top-0 h-full w-full flex items-center justify-center absolute ${
                        showTada ? 'scale-100' : 'scale-0'
                    }`}
                >
                    🎉
                </span>
            </button>
            {state.paymentImplementations?.includes('vipps') && (
                <>
                    <button
                        className="flex flex-row gap-1 items-center bg-textBlack border py-3 relative overflow-hidden h-[50px] rounded-md text-[#fff] sm:w-[200px] w-full font-bold  disabled:opacity-50 disabled:cursor-not-allowed justify-center hover:brightness-95"
                        onClick={async () => {
                            setShowLoader(true);
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
                        {showLoader ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        ) : (
                            <>
                                <span>{_t('payment.vipps.button')}</span>
                                <svg
                                    width="64"
                                    height="15"
                                    viewBox="0 0 64 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M64 4.3784C63.2798 1.63069 61.5314 0.540009 59.1448 0.540009C57.2111 0.540009 54.7843 1.63069 54.7843 4.25716C54.7843 5.95402 55.9566 7.28761 57.8694 7.63118L59.6797 7.95418C60.9142 8.1763 61.2639 8.64111 61.2639 9.26742C61.2639 9.97448 60.5028 10.3785 59.3714 10.3785C57.8904 10.3785 56.9646 9.85324 56.8205 8.37829L54.2082 8.78248C54.6193 11.6309 57.17 12.8029 59.4739 12.8029C61.6547 12.8029 63.9793 11.5501 63.9793 9.02495C63.9793 7.30752 62.9299 6.05534 60.9756 5.6912L58.9805 5.32793C57.8694 5.12594 57.4994 4.58038 57.4994 4.05518C57.4994 3.38838 58.2192 2.9645 59.2067 2.9645C60.4617 2.9645 61.3461 3.38838 61.3873 4.78237L64 4.3784ZM5.925 8.70128L8.6399 0.842871H11.8283L7.09686 12.4994H4.73146L0 0.84309H3.18843L5.925 8.70128ZM22.6083 4.17642C22.6083 5.1056 21.8678 5.75204 21.0036 5.75204C20.1397 5.75204 19.3993 5.1056 19.3993 4.17642C19.3993 3.24702 20.1397 2.60079 21.0036 2.60079C21.8678 2.60079 22.6086 3.24702 22.6086 4.17642H22.6083ZM23.1021 8.29777C22.0321 9.67114 20.9008 10.6206 18.9053 10.6207C16.8693 10.6207 15.285 9.40858 14.0507 7.63097C13.5569 6.90356 12.7958 6.74206 12.2402 7.1259C11.726 7.48961 11.6029 8.25728 12.0757 8.92408C13.783 11.4897 16.1487 12.9844 18.9051 12.9844C21.4357 12.9844 23.4107 11.7725 24.9533 9.75216C25.5291 9.00483 25.5086 8.23715 24.9533 7.81283C24.4388 7.40842 23.6777 7.55044 23.1021 8.29777ZM30.2 6.64094C30.2 9.02494 31.5989 10.2776 33.1625 10.2776C34.6434 10.2776 36.1659 9.10569 36.1659 6.64094C36.1659 4.21645 34.6434 3.04502 33.1828 3.04502C31.5989 3.04502 30.2 4.15605 30.2 6.64094ZM30.2 2.45941V0.862998H27.2996V16.54H30.2V10.964C31.1669 12.2571 32.4217 12.8029 33.8409 12.8029C36.4951 12.8029 39.0868 10.7421 39.0868 6.49978C39.0868 2.43884 36.392 0.540215 34.0879 0.540215C32.257 0.540215 31.0025 1.36829 30.2 2.45941ZM44.1276 6.64094C44.1276 9.02494 45.5262 10.2776 47.0898 10.2776C48.5708 10.2776 50.093 9.10569 50.093 6.64094C50.093 4.21645 48.5708 3.04502 47.1102 3.04502C45.5262 3.04502 44.1273 4.15605 44.1273 6.64094H44.1276ZM44.1276 2.45941V0.862998H44.1273H41.227V16.54H44.1273V10.964C45.0943 12.2571 46.349 12.8029 47.7683 12.8029C50.4222 12.8029 53.0142 10.7421 53.0142 6.49978C53.0142 2.43884 50.3194 0.540215 48.0152 0.540215C46.1843 0.540215 44.9298 1.36829 44.1276 2.45941Z"
                                        fill="white"
                                    />
                                </svg>
                            </>
                        )}
                    </button>
                </>
            )}
        </div>
    );
};
