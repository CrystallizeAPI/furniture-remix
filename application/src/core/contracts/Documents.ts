import { Image } from './Image';
import { RichText } from './RichText';
import { SEO } from './SEO';
import { Video } from './Video';
import { Paragraph } from './Paragraph';

export type Story = {
    id: string;
    path: string;
    name: string;
    title: string;
    intro: RichText;
    createdAt: string;
    updatedAt: string;
    shape: string;
    media: Image[] | Video[];
    story: Paragraph[];
    upNext: Array<any>;
    featuredProducts: Array<{
        name: string;
        path: string;
        defaultVariant: {
            price: number;
            images: Image[];
        };
    }>;
    seo: SEO;
};
