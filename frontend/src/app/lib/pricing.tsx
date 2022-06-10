export default function getRelativePriceVariants(priceVariants: any) {
    const defaultPrice = priceVariants?.find((pv: any) => pv.identifier === 'default') || {};

    // Get price variant with identifier "sales" from Crystallize
    const discountPrice =
        priceVariants?.find((pv: any) => pv.identifier === 'sales' && pv.currency === defaultPrice?.currency) || null;

    const discountPercentage = ((defaultPrice?.price - discountPrice?.price) / defaultPrice?.price) * 100;
    return {
        defaultPrice,
        discountPrice: discountPrice,
        discountPercentage: isNaN(discountPercentage) ? 0 : Math.round(discountPercentage),
    };
}
