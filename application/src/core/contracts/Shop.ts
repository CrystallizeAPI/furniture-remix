import { Grid } from './Grid';
import { Item } from './Item';
import { ProductSlim } from './Product';
import { RichText } from './RichText';
import { SEO } from './SEO';

export type Shop = Item & {
    title: string;
    description: string;
    hero?: Grid;
    seo: SEO;
    categories: Array<
        Item & {
            description?: RichText;
            products: ProductSlim[];
        }
    >;
};
