import React from 'react';
import { Image, Video } from '@crystallize/reactjs-components';
import { Item, Tile as TileType, TileViewWrapperOptions } from './types';

export const Tile: React.FC<{
    tile: TileType | Item;
    children: React.ReactNode;
    options?: TileViewWrapperOptions;
}> = ({ tile, children, options }) => {
    const { background } = tile;
    let backgroundElement: React.ReactNode | null = null;
    if (background.images && background.images.length > 0) {
        backgroundElement = (
            <div className="crystallize-background-image" style={options?.background?.style}>
                <Image
                    {...background.images[0]}
                    {...options?.background?.imageProps}
                    size="100vw"
                    fallbackAlt={tile.title}
                />
            </div>
        );
    }
    if (background.videos && background.videos.length > 0) {
        backgroundElement = (
            <div className="crystallize-background-video" style={options?.background?.style}>
                <Video
                    {...background.videos[0]}
                    {...options?.background?.imageProps}
                    autoPlay
                    loop
                    muted
                    controls={false}
                />
            </div>
        );
    }
    return (
        <div
            className={`crystallize-tile crystallize-tile-view-${tile.view} ${
                tile.cssPreset ? 'crystallize-tile-preset-' + tile.cssPreset : ''
            }`}
            style={{
                ...options?.style,
                background: tile.styling?.background?.color ?? null,
                color: tile.styling?.font?.color ?? null,
                // fontSize: tile.styling?.font?.size ?? null,
            }}
        >
            {backgroundElement}
            <div style={{ width: '100%', zIndex: 20 }}>{children}</div>
        </div>
    );
};
