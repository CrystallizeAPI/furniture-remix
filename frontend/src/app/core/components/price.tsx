import getRelativePriceVariants from '~/lib/pricing';

export const Price = ({ priceVariants }: { priceVariants: any }) => {
    let { defaultPrice, discountPrice, discountPercentage } = getRelativePriceVariants(priceVariants);

    return (
        <div>
            {priceVariants.length > 1 ? (
                <div className="flex flex-wrap gap-2 flex-col">
                    <div className="text-xl font-bold">€{discountPrice?.price}</div>
                    <div className="flex gap-3 items-center">
                        <div className="line-through">€{defaultPrice?.price}</div>
                        <div className="text-lg text-red">{discountPercentage}%</div>
                    </div>
                </div>
            ) : (
                <div className="text-xl font-bold">€{defaultPrice.price}</div>
            )}
        </div>
    );
};
