import { Image } from './Image';
import { RichText } from './RichText';
import { SEO } from './SEO';
import { Video } from './Video';
import { Paragraph } from './Paragraph';
import { ProductSlim } from './Product';

export interface Story {
    path: string;
    name: string;
    title: string;
    intro: RichText;
    createdAt: string;
    updatedAt: string;
    shape: string;
    media: {
        id: string;
        content: {
            images?: Array<Image>;
            videos?: Array<Video>;
        };
    };
    story?: Array<Paragraph>;
    relatedArticles?: any;
    featuredProducts?: Array<ProductSlim>;
    seo?: SEO;
}

export interface CuratedStory extends Omit<Story, 'featuredProducts'> {
    merchandising?: Array<{
        products: any[];
        hotspotX: {
            number?: string;
            unit?: string;
        };
        hotspotY: {
            number?: string;
            unit?: string;
        };
    }>;
}

export type DocumentType = Story | CuratedStory;
