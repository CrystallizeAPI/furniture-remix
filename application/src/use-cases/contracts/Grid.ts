export type Grid = {
    id: string;
    rows: GridRow[];
};

export declare type GridCell = {
    layout: {
        rowspan: number;
        colspan: number;
        rowIndex: number;
        colIndex: number;
    };
    [key: string]: any;
};
export declare type GridRow = {
    columns: GridCell[];
};
