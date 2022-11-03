import { RichText } from './RichText';
import { Topic } from './Topic';
import { Image } from './Image';
import { ProductVariant } from './ProductVariant';
import { CrystallizePropertiesTable } from './PropertiesTable';
import { Dimensions } from './Dimensions';
import { FileDownload } from './Files';
import { RelatedItem } from './RelatedItem';
import { Paragraph } from './Paragraph';

export type Product = {
    id: string;
    path: string;
    name: string;
    title: string;
    description?: string;
    story?: Array<Paragraph>;
    specifications: Array<CrystallizePropertiesTable>;
    dimensions: Dimensions;
    downloads: Array<FileDownload>;
    relatedItems: Array<RelatedItem>;
    topics: Array<Topic>;
    seo: {
        title: string;
        description?: string;
        image?: string;
    };
    vat: {
        name: string;
        rate: number;
    };
    defaultVariant: ProductVariant;
    variants: Array<ProductVariant>;
};
