import { Grid } from './Grid';
import { Item } from './Item';
import { SEO } from './SEO';

export type Cateogry = Item & {
    title: string;
    description: string;
    seo: SEO;
    hero?: Grid;
};
