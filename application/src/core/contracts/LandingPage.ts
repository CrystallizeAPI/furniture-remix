import { Grid } from './Grid';
import { Item } from './Item';
import { SEO } from './SEO';

export type LandingPage = Item & {
    grids: Array<Grid>;
    seo: SEO;
};
