import { Image } from './Image';
import { RichText } from './RichText';
import { SEO } from './SEO';
import { Video } from './Video';
import { Paragraph } from './Paragraph';
import { ProductSlim } from './Product';
import { Item } from './Item';
import { ProductListHostpot } from './ProductListHostpot';

export type CommonStory = Item & {
    title: string;
    description: RichText;
    medias: {
        images: Array<Image>;
        videos: Array<Video>;
    };
    story: Array<Paragraph>;
    relatedArticles: any[];
    seo: SEO;
};

export type Story = CommonStory & {
    featuredProducts: Array<ProductSlim>;
    createdAt: string;
    type: 'story';
};

export type CuratedStory = CommonStory & {
    type: 'curated-product-story';
    merchandising: Array<ProductListHostpot>;
};

export type StorySlim = Item & Pick<Story, 'title' | 'medias' | 'description' | 'type'>;

export type CuratedStorySlim = Item & Pick<CuratedStory, 'title' | 'medias' | 'description' | 'merchandising' | 'type'>;
