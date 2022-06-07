import { Video } from '@crystallize/reactjs-components';
import { Image } from '@crystallize/reactjs-components/dist/image';
import { TileViewComponentProps } from '~/lib/grid-tile/types';

export const GenericTileView: React.FC<TileViewComponentProps> = ({ tile, options }) => {
    const { title, description, media, ctas, background } = tile;

    let backgroundElement = null;
    if (background.images && background.images.length > 0) {
        backgroundElement = (
            <div className="crystallize-background-image">
                <Image {...background.images[0]} sizes="(max-width: 500px) 300px, 700px" loading="lazy" />
            </div>
        );
    }
    if (background.videos && background.videos.length > 0) {
        backgroundElement = (
            <div className="crystallize-background-image">
                <Video {...background.videos[0]} sizes="(max-width: 500px) 300px, 700px" loading="lazy" />
            </div>
        );
    }

    return (
        <div
            className={`crystallize-generic-tile-view view-${tile.view}`}
            style={{ backgroundColor: background.color }}
        >
            {backgroundElement}
            <div className="crystallize-generic-tile-view-header">
                {title && <h2>{title}</h2>}
                {description && <p>{description}</p>}
            </div>
            <div className="crystallize-generic-tile-view-body">
                {media.images && media.images.length > 0 && <GenericTileViewWithImage image={media.images[0]} />}
                {media.videos && media.videos.length > 0 && <GenericTileViewWithVideo video={media.videos[0]} />}
                {media.items && media.items.length > 0 && <GenericTileViewWithItems items={media.items} />}
            </div>

            {ctas && ctas.length > 0 && (
                <div className="crystallize-generic-tile-view-ctas">
                    {ctas.map((cta) => (
                        <button className="crystallize-generic-tile-view-cta" key={cta.link}>
                            <a href={cta.link}>{cta.text}</a>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export const GenericTileViewWithItems: React.FC<{ items: any[] }> = ({ items }) => {
    return (
        <div className="crystallize-generic-tile-view-body-items">
            {items.map((item: any, index: number) => {
                return <GenericTileViewWithEmbed item={item} key={index} />;
            })}
        </div>
    );
};

export const GenericTileViewWithEmbed: React.FC<{ item: any }> = ({ item }) => {
    return (
        <div className="crystallize-generic-tile-view-item">
            <a href={item.path}>{item.name ?? ''}</a>
        </div>
    );
};

export const GenericTileViewWithImage: React.FC<{ image: any }> = ({ image }) => {
    return (
        <div className="crystallize-generic-tile-view-image">
            <Image {...image} sizes="(max-width: 500px) 300px, 700px" loading="lazy" />
        </div>
    );
};

export const GenericTileViewWithVideo: React.FC<{ video: any }> = ({ video }) => {
    return (
        <div className="crystallize-generic-tile-view-video">
            <Video {...video} />
        </div>
    );
};
