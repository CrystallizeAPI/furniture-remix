import { ProductStockLocation, ProductVariant as APIProductVariant } from '@crystallize/js-api-client';
import { ProductVariant } from '~/core/contracts/ProductVariant';
import { StockLocation } from '~/core/contracts/StockLocation';
import typedImages from '~/use-cases/mapper/mapAPIImageToImage';
import mapAPIPriceVariantsToPriceVariant from './mapAPIPriceVariantsToPriceVariant';

export default (variant: APIProductVariant): ProductVariant => {
    const priceVariants = mapAPIPriceVariantsToPriceVariant(variant.priceVariants ?? []);
    return {
        id: variant.id,
        isDefault: !!variant.isDefault,
        name: variant.name || 'Unknown',
        sku: variant.sku,
        priceVariants,
        stockLocations:
            variant.stockLocations?.reduce(
                (memo: Record<string, StockLocation>, stockLocation: ProductStockLocation) => {
                    return {
                        ...memo,
                        [stockLocation.identifier]: {
                            identifier: stockLocation.identifier,
                            name: stockLocation.name || 'Unknown',
                            stock: stockLocation.stock || 0,
                        },
                    };
                },
                {},
            ) || {},
        images: typedImages(variant.images),
        attributes: variant.attributes,
    };
};
