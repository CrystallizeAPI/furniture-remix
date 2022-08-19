import { Product, ProductVariant } from '@crystallize/js-api-client';
import { Image } from '@crystallize/reactjs-components';
import { Price } from '~/core/components/price';
import { VariantSelector } from '~/core/components/variant-selector';
import { VariantPack, VariantPackItem } from '../add-to-cart-button';

export const CuratedProductItem: React.FC<{
    merch: any;
    merchIndex: number;
    pack: VariantPack;
    updatePack: Function;
}> = ({ merch, pack, merchIndex, updatePack }) => {
    return (
        <>
            {merch.products?.map((product: any, productIndex: number) => (
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
    product: Product;
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
            <div className="flex gap-2 justify-between flex-wrap items-center py-2">
                <div className="flex items-center w-8/12">
                    <div className="w-[60px] h-[80px] img-container img-cover">
                        <Image sizes="200px" {...selecedPackItem.variant?.images?.[0]} />
                    </div>
                    <div className="pl-4 pb-2">
                        {selecedPackItem.variant.name}
                        <Price variant={selecedPackItem.variant} size="small" />
                    </div>
                </div>
                <div className="flex gap-2">
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
                    <div className="flex flex-col">
                        <span className="block text-xs pb-1 font-medium">Quantity</span>
                        <div>
                            <button
                                className="py-2 px-4 bg-[#fff] text-sm hover:bg-grey-400"
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
                                className="py-2  px-4 bg-[#fff] text-sm w-[60px] text-center "
                                onChange={(e) =>
                                    updatePack(selecedPackItem, {
                                        ...selecedPackItem,
                                        quantity: parseInt(e.target.value),
                                    })
                                }
                            />
                            <button
                                className="py-2 px-4 bg-[#fff] text-sm "
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
                </div>
            </div>
        </>
    );
};
