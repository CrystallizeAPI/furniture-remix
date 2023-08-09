import { Video } from '@crystallize/reactjs-components';
import { Image } from '@crystallize/reactjs-components';
import { TileViewComponentProps } from '../../lib/grid-tile/types';

export const GenericTileView: React.FC<TileViewComponentProps> = ({ tile, options }) => {
    const { title, description, content, ctas, styling } = tile;

    return (
        <div
            className={`crystallize-generic-tile-view view-${tile.view}`}
            style={{ backgroundColor: styling?.background.color }}
        >
            <div className="crystallize-generic-tile-view-header">
                {title && <h2>{title}</h2>}
                {description && <p>{description}</p>}
            </div>
            <div className="crystallize-generic-tile-view-body">
                {content.images && content.images.length > 0 && <GenericTileViewWithImage image={content.images[0]} />}
                {content.videos && content.videos.length > 0 && <GenericTileViewWithVideo video={content.videos[0]} />}
                {content.items && content.items.length > 0 && <GenericTileViewWithItems items={content.items} />}
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
        <div className="crystallize-generic-tile-view-image ">
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
