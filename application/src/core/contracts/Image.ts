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
};
