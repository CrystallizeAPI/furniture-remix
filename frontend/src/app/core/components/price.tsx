import getRelativePriceVariants from '~/lib/pricing';

export const Price = ({ priceVariants, renderType = 'default' }: { priceVariants: any; renderType: string }) => {
    let { defaultPrice, discountPrice, discountPercentage } = getRelativePriceVariants(priceVariants);
    const renderingTypes = {
        default: (
            <div>
                {priceVariants.length > 1 ? (
                    <div className="flex flex-wrap  flex-col">
                        <div className="line-through font-bold pt-1 text-sm">€{defaultPrice?.price}</div>
                        <div className="flex gap-2 items-center ">
                            <div className="text-4xl font-bold text-green2">€{discountPrice?.price}</div>
                            <div className="text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-bold ">
                                -{discountPercentage}%
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-4xl font-bold">€{defaultPrice?.price}</div>
                )}
            </div>
        ),
        microformat: (
            <div>
                {priceVariants.length > 1 ? (
                    <div className="flex flex-wrap  flex-col">
                        <div className="flex gap-2 items-center ">
                            <div className="text-1xl font-bold text-green2">€{discountPrice?.price}</div>
                            <div className="text-sm py-1 px-2 h-[26px] rounded-md bg-[#efefef] font-bold ">
                                -{discountPercentage}%
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-1xl font-bold">€{defaultPrice?.price}</div>
                )}
            </div>
        ),
    };
    return renderingTypes[renderType] || null;
};
