import { Topic } from './Topic';
import { ProductVariant } from './ProductVariant';
import { CrystallizePropertiesTable } from './PropertiesTable';
import { Dimensions } from './Dimensions';
import { FileDownload } from './FileDownload';
import { Paragraph } from './Paragraph';
import { Item } from './Item';
import { SEO } from './SEO';

export type Product = Item & {
    id: string;
    title: string;
    description?: string;
    story?: Array<Paragraph>;
    specifications: Array<CrystallizePropertiesTable>;
    dimensions: Dimensions;
    downloads: Array<FileDownload>;
    relatedItems: Array<ProductSlim>;
    topics: Array<Topic>;
    seo: SEO;
    vat: {
        name: string;
        rate: number;
    };
    defaultVariant: ProductVariant;
    variants: Array<ProductVariant>;
};

export type ProductSlim = Item & {
    id: string;
    variant: ProductVariant;
    variants?: ProductVariant[];
    topics: Array<Topic>;
};

export type SearchByTopicsProductList = {
    products: ProductSlim[];
    topics: Topic[];
};
