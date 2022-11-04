import { RichText } from './RichText';

export type FileDownload = {
    title: string;
    description?: RichText;
    files: Array<{
        title: string;
        url: string;
    }>;
};
