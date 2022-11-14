import { Grid } from './Grid';
import { Item } from './Item';
import { ProductSlim } from './Product';
import { SEO } from './SEO';
import { CuratedStorySlim, StorySlim } from './Story';

export type Category = Item & {
    title: string;
    description: string;
    seo: SEO;
    hero?: Grid;
};

export type CategoryWithChildren = Category & {
    children: Array<StorySlim | CuratedStorySlim | ProductSlim>;
};
