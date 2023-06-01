import React from 'react';
import { RichText } from '~/use-cases/contracts/RichText';

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

export type TileViewWrapperOptions = {
    background?: {
        style?: React.CSSProperties;
        imageProps?: any;
        videoProps?: any;
    };
    style?: React.CSSProperties;
};

export type Tile = {
    title?: string;
    description?: any;
    content: {
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
    };
    isFullWidth?: boolean;
    styling?: any;
    cssPreset?: string;
};

export type Item = any;
