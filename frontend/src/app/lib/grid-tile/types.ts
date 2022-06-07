import React from 'react';

export type TileViewComponentProps = {
    tile: Tile;
    options?: any;
};

export type ItemViewComponentProps = {
    item: Item;
    options?: any;
};

export type TileViewComponentMapping = Record<
    string,
    React.FunctionComponent<{ children: React.ReactNode } & TileViewComponentProps>
>;
export type ItemComponentMapping = Record<
    string,
    React.FunctionComponent<{ children: React.ReactNode } & ItemViewComponentProps>
>;

export type Tile = {
    title?: string;
    description?: string;
    media: {
        items?: any[];
        images?: any[];
        videos?: any[];
    };
    ctas: {
        link: string;
        text: string;
    }[];
    view: string;
    background: {
        images?: any[];
        videos?: any[];
        color?: string;
    };
};

export type Item = any;
