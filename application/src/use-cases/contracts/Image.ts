import { RichTextContent } from '@crystallize/js-api-client';

export type Image = {
    key: string;
    url: string;
    altText: string;
    variants: Array<{
        key: string;
        height: number;
        width: number;
        url: string;
    }>;
    caption?: RichTextContent;
};
