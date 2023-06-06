'use client';
import { useState } from 'react';
import { useAppContext } from '../../app-context/provider';
import { Product } from '../../components/item/product';
import { ProductSlim } from '~/use-cases/contracts/Product';

export const FilteredProducts: React.FC<{ products: ProductSlim[] }> = ({ products }) => {
    let [checked, setChecked] = useState(true);
    const { _t } = useAppContext();
    const displayableProducts = checked ? products : products.filter((product) => product.variant.isDefault === true);
    return (
        <div className="mt-10">
            <div className="flex justify-between items-center">
                <h2 className="font-medium text-md my-5">{_t('search.foundResults', { count: products?.length })}</h2>
                {products?.length > 0 && (
                    <div className="flex items-center gap-3">
                        <span className="font-medium text-md my-5">{_t('search.showVariants')}</span>
                        <label className="relative inline-block w-[46px] h-[24px]">
                            <input
                                type="checkbox"
                                className="opacity-0 h-0 w-0"
                                onChange={(e) => setChecked(e.target.checked)}
                                defaultChecked={checked}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {displayableProducts?.map((product, index) => (
                    <Product key={index} item={product} />
                ))}
            </div>
        </div>
    );
};
