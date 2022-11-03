import { Image } from './Image';

export type Video = {
    id: string;
    playlists: string[];
    playlist: string;
    title: string;
    thumbnails: Image[];
};
