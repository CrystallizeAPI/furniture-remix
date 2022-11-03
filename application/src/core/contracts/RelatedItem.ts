import { Image } from './Image';
import { Price } from './Price';

export type RelatedItem = {
    name: string;
    path: string;
    defaultVariant: {
        priceVariants: Record<string, Price>;
        images: Image[];
    };
};
