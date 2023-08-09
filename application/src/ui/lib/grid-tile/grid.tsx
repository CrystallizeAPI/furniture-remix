import { GridCell, GridRenderer, GridRenderingType, GridRow } from '@crystallize/reactjs-components';
import React from 'react';
import { GenericItem } from './generic-item';
import { GenericTileView } from './generic-tile-view';
import { Item, ItemComponentMapping, Tile, TileViewComponentMapping, TileViewWrapperOptions } from './types';
import { Video } from '@crystallize/reactjs-components';
import { Image } from '@crystallize/reactjs-components';

export const Grid: React.FC<{
    grid: {
        rows: GridRow[];
    };
    tileViewComponentMapping: TileViewComponentMapping;
    itemComponentMapping: ItemComponentMapping;
    type?: GridRenderingType;
    style?: React.CSSProperties;
    styleForCell?: (cell: GridCell, styles: React.CSSProperties) => React.CSSProperties;
    options?: TileViewWrapperOptions;
}> = ({
    grid,
    tileViewComponentMapping,
    itemComponentMapping,
    type = GridRenderingType.RowCol,
    options,
    style,
    styleForCell,
}) => {
    return (
        <GridRenderer
            grid={grid}
            type={type}
            styleForCell={styleForCell}
            style={style}
            cellComponent={({ cell, dimensions, children }) => {
                const cellItem: Tile | Item = cell?.item;

                if (!cellItem) {
                    return null;
                }
                const tile = normalizeTile(cellItem);
                if (tile?.view) {
                    const Component = tileViewComponentMapping[tile.view] || GenericTileView;
                    return (
                        <Tile tile={tile} options={options}>
                            <Component tile={tile} options={{ dimensions, layout: cell.layout }}>
                                {children}
                            </Component>
                        </Tile>
                    );
                }
                const Component = itemComponentMapping[cellItem.type.toLowerCase()] || GenericItem;
                return (
                    <div style={options?.style}>
                        <Component item={cellItem} options={{ dimensions, layout: cell.layout }}>
                            {children}
                        </Component>
                    </div>
                );
            }}
        />
    );
};

const Tile: React.FC<{
    tile: Tile | Item;
    children: React.ReactNode;
    options?: TileViewWrapperOptions;
}> = ({ tile, children, options }) => {
    let backgroundElement = null;
    const { background } = tile;
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

const componentContent = (cellItem: any, id: string, fallbackValue: any = undefined): any | undefined => {
    const component = cellItem.components.find((component: any) => component.id === id);
    return component?.content || fallbackValue;
};

const componentChoiceContent = (
    cellItem: any,
    id: string,
    choiceId: string,
    fallbackValue: any = undefined,
): any | undefined => {
    const component = cellItem.components.find((component: any) => component.id === id);
    return component?.content?.selectedComponent?.content[choiceId] || fallbackValue;
};

const componentChunkContent = (
    cellItem: any,
    id: string,
    chunkId: string,
    fallbackValue: any = undefined,
): any | undefined => {
    const component = cellItem.components.find((component: any) => component.id === id);
    const chunk = component?.content?.chunks[0]?.find((chunk: any) => chunk.id === chunkId);
    return chunk?.content || fallbackValue;
};

const normalizeTile = (cellItem: any): Tile | null => {
    const components = cellItem.components;
    if (!components) {
        return null;
    }
    const styling = componentChunkContent(cellItem, 'styling', 'properties', [])?.sections?.reduce(
        (result: any, section: any) => {
            const sectionName = section.title.toLowerCase();
            section.properties.forEach((property: any) => {
                if (!result[sectionName]) {
                    result[sectionName] = {};
                }
                result[sectionName][property.key.toLowerCase()] = property.value;
            });
            return result;
        },
        {},
    );

    return {
        view: componentContent(cellItem, 'view')?.options[0]?.value.toLowerCase(),
        title: componentContent(cellItem, 'title')?.text,
        description: componentContent(cellItem, 'description')?.json,
        content: {
            images: componentChoiceContent(cellItem, 'content', 'images') || undefined,
            videos: componentChoiceContent(cellItem, 'content', 'videos') || undefined,
            items: componentChoiceContent(cellItem, 'content', 'items') || undefined,
        },
        ctas:
            componentContent(cellItem, 'ctas')?.chunks.map((cta: any) => {
                return {
                    text: cta[0].content?.text,
                    link: cta[1].content?.text,
                };
            }) || [],
        background: {
            images: componentChoiceContent(cellItem, 'background', 'images') || undefined,
            videos: componentChoiceContent(cellItem, 'background', 'videos') || undefined,
        },
        styling,
        isFullWidth: componentChunkContent(cellItem, 'styling', 'use-full-width')?.value || false,
        cssPreset: componentChunkContent(cellItem, 'styling', 'css-preset')?.options?.[0]?.key?.toLowerCase(),
    };
};
