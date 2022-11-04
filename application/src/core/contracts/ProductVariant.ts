import { Price } from './Price';
import { Image } from './Image';
import { StockLocation } from './StockLocation';

export type ProductVariant = {
    id: string;
    isDefault: boolean;
    name: string;
    description?: string;
    sku: string;
    priceVariants: Record<string, Price>;
    stockLocations: Record<string, StockLocation>;
    images: Image[];
    attributes: Record<string, string>;
};
