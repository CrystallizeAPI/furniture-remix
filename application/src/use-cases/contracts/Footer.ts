import { Image } from './Image';
import { RichText } from './RichText';

export type Footer = {
    contact: RichText;
    links: RichText;
    copyright: string;
    socialLinks: Array<{
        logo: Array<Image>;
        link: string;
    }>;
    promotions: {
        heading: string;
        cards: Array<{
            title: string;
            image: Array<Image>;
            link: string;
        }>;
    };
};
