import { GridRenderer, GridRenderingType } from '@crystallize/reactjs-components/dist/grid';
import React from 'react';
import { GenericItem } from './generic-item';
import { GenericTileView } from './generic-tile-view';
import { Item, ItemComponentMapping, Tile, TileViewComponentMapping } from './types';

export const Grid: React.FC<{
    grid: any;
    tileViewComponentMapping: TileViewComponentMapping;
    itemComponentMapping: ItemComponentMapping;
    type?: GridRenderingType;
}> = ({ grid, tileViewComponentMapping, itemComponentMapping, type = GridRenderingType.RowCol }) => {
    return (
        <GridRenderer
            grid={grid}
            type={type}
            cellComponent={({ cell, totalColSpan, children }) => {
                const cellItem: Tile | Item = cell?.item;
                if (!cellItem) {
                    return null;
                }
                const tile = normalizeTile(cellItem);
                if (tile) {
                    const Component = tileViewComponentMapping[tile.view.toLowerCase()] || GenericTileView;
                    return (
                        <Tile tile={tile}>
                            <Component tile={tile} options={totalColSpan}>
                                {children}
                            </Component>
                        </Tile>
                    );
                }

                const Component = itemComponentMapping[cellItem.type.toLowerCase()] || GenericItem;
                return (
                    <div
                        className="crystallize-cell"
                        style={{
                            width: '100%',
                        }}
                    >
                        <Component item={cellItem} options={totalColSpan}>
                            {children}
                        </Component>
                    </div>
                );
            }}
        />
    );
};

const componentContent = (cellItem: any, id: string): any | null => {
    const component = cellItem.components.find((component: any) => component.id === id);
    return component?.content;
};

const componentChoiceContent = (cellItem: any, id: string, choiceId: string): any | null => {
    const component = cellItem.components.find((component: any) => component.id === id);
    return component?.content?.selectedComponent?.content[choiceId] || null;
};

const normalizeTile = (cellItem: any): Tile | null => {
    const components = cellItem.components;
    if (!components) {
        return null;
    }

    return {
        view: componentContent(cellItem, 'view')?.options[0]?.value,
        title: componentContent(cellItem, 'title')?.text,
        description: componentContent(cellItem, 'description')?.plainText.join(' '),
        media: {
            images: componentChoiceContent(cellItem, 'media', 'images') || null,
            videos: componentChoiceContent(cellItem, 'media', 'videos') || null,
            items: componentChoiceContent(cellItem, 'media', 'items') || null,
        },
        ctas: componentContent(cellItem, 'cta')?.chunks.map((cta: any) => {
            return {
                text: cta[1].content.text,
                link: cta[0].content.text,
            };
        }),
        background: {
            images: componentChoiceContent(cellItem, 'background', 'images') || null,
            videos: componentChoiceContent(cellItem, 'background', 'videos') || null,
            color: '#' + componentChoiceContent(cellItem, 'background', 'text'),
        },
    };
};

const Tile: React.FC<{ tile: Tile | Item; children: React.ReactNode }> = ({ tile, children }) => {
    return (
        <div
            className="crystallize-cell crystallize-cell-tile"
            style={{
                background: tile.background.color,
                width: '100%',
            }}
        >
            {children}
        </div>
    );
};
