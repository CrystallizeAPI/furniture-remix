import { ProductVariant } from '@crystallize/js-api-client';
import { Image } from '@crystallize/reactjs-components';
import { Price } from '../components/price';
import { VariantSelector } from './variant-selector';
import { ProductSlim } from '~/use-cases/contracts/Product';
import { ProductListHostpot } from '~/use-cases/contracts/ProductListHostpot';
import { VariantPack, VariantPackItem } from './add-to-cart-button';

export const CuratedProductItem: React.FC<{
    merch: ProductListHostpot;
    merchIndex: number;
    pack: VariantPack;
    updatePack: Function;
}> = ({ merch, pack, merchIndex, updatePack }) => {
    return (
        <>
            {merch.products.map((product, productIndex) => (
                <Product
                    product={product}
                    pack={pack}
                    key={productIndex}
                    updatePack={updatePack}
                    packKey={`${merchIndex}-${productIndex}`}
                />
            ))}
        </>
    );
};

const Product = ({
    product,
    pack,
    updatePack,
    packKey,
}: {
    product: ProductSlim;
    pack: VariantPack;
    updatePack: Function;
    packKey: string;
}) => {
    if (!product?.variants) {
        return null;
    }

    const selecedPackItem: VariantPackItem = pack.find((packItem: VariantPackItem) => packItem.key === packKey) || {
        variant: product.variants[0],
        quantity: 1,
    };
    if (!selecedPackItem) {
        return null;
    }

    return (
        <>
            <div className="border-b border-[#dfdfdf] w-full py-3 ">
                <div className="grid w-full grid-cols-[0.35fr_1fr]">
                    <div className="w-full img-container overflow-hidden rounded-md">
                        <Image
                            sizes="200px"
                            {...selecedPackItem.variant?.images?.[0]}
                            fallbackAlt={selecedPackItem.variant.name}
                        />
                    </div>
                    <div>
                        <div className="gap-2 pl-4 flex ">
                            <div className=" w-full">
                                <div className="pb-1">{selecedPackItem.variant.name}</div>
                                <Price variant={selecedPackItem.variant} size="small" />
                            </div>
                            <div className="flex flex-col-reverse max-w-[40px] w-full items-center justify-end ">
                                <button
                                    className="py-1 w-full block text-sm rounded-md border-transparent hover:bg-[#efefef]"
                                    onClick={() =>
                                        updatePack(selecedPackItem, {
                                            ...selecedPackItem,
                                            quantity: selecedPackItem.quantity - 1,
                                        })
                                    }
                                >
                                    -
                                </button>
                                <input
                                    value={selecedPackItem.quantity}
                                    type="text"
                                    className="py-2  w-full w-full text-sm text-center hover:bg-[#efefef] active:bg-[#efefef]"
                                    onChange={(e) =>
                                        updatePack(selecedPackItem, {
                                            ...selecedPackItem,
                                            quantity: parseInt(e.target.value),
                                        })
                                    }
                                />
                                <button
                                    className="py-1 w-full block text-sm rounded-md border-transparent hover:bg-[#efefef]"
                                    onClick={() =>
                                        updatePack(selecedPackItem, {
                                            ...selecedPackItem,
                                            quantity: selecedPackItem.quantity + 1,
                                        })
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="pl-4 mt-2 max-w-[100%]">
                            <div className="grid grid-cols-1 grid-col-2 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                                <VariantSelector
                                    variants={product.variants}
                                    selectedVariant={selecedPackItem.variant}
                                    onVariantChange={(variant: ProductVariant) => {
                                        updatePack(selecedPackItem, {
                                            variant,
                                            quantity: selecedPackItem.quantity,
                                        });
                                    }}
                                    renderingType="dropdown"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
