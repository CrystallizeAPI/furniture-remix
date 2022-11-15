import { RichText } from './RichText';
import { Image } from './Image';
import { Video } from './Video';

export type Paragraph = {
    title: string;
    body: RichText;
    images: Image[];
    videos?: Video[];
};
