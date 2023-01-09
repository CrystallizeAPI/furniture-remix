import { Image } from './Image';

export type Video = {
    id: string;
    playlists: [];
    playlist: string;
    title?: string;
    thumbnails?: any; //throwing error here if Image[] is used;
};
