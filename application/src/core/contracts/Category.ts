import { Grid } from './Grid';
import { Item } from './Item';
import { SEO } from './SEO';
import { CuratedStorySlim, StorySlim } from './Story';

export type Cateogry = Item & {
    title: string;
    description: string;
    seo: SEO;
    hero?: Grid;
};

export type CateogryWithChildren = Cateogry & {
    children: Array<StorySlim | CuratedStorySlim>;
};
