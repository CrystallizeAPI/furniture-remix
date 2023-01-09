import { Video } from '../../contracts/Video';

export default (videos?: Video[]) => {
    return (
        videos?.map((video) => {
            return {
                id: video.id,
                playlists: video.playlists,
                playlist: video.playlist,
                title: video.title,
                thumbnails: video.thumbnails,
            };
        }) || []
    );
};
