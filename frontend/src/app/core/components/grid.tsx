import { GridItem } from '~/core/components/grid-item';

const getTotalGridDimensions = (rows: any) => {
    const totalColSpan = rows[0].columns.reduce((acc: any, col: any) => acc + col.layout.colspan, 0);

    return totalColSpan;
};

const cellPlacement = ({
    item,
    layout,
    totalColSpan,
    cellIndex,
    rowIndex,
}: {
    item: any;
    layout: any;
    totalColSpan: any;
    cellIndex: any;
    rowIndex: any;
}) => {
    const fullWidthTileComponentValue = item?.components?.find((component: any) => component.id === 'fullwidth-tile')
        ?.content?.value;

    if (layout?.colspan === totalColSpan && fullWidthTileComponentValue) {
        return {
            gridColumn: `1 / span ${totalColSpan + 2}`,
            gridRow: `${rowIndex + 1} / span ${layout?.rowspan}`,
        };
    }
    if (cellIndex > 0) {
        return {
            gridColumn: `${cellIndex + 2} / span ${layout?.colspan}`,
        };
    } else
        return {
            gridColumn: `${cellIndex + 2} / span ${layout?.colspan}`,
            gridRowStart: `span ${layout?.rowspan}`,
        };
};
export const Grid = ({ grid }: { grid: any }) => {
    const totalColSpan = getTotalGridDimensions(grid.rows);
    const colWidth = Math.round(1600 / totalColSpan);

    return (
        <div
            className="frntr-grid gap-3 border-3"
            style={{
                gridTemplateColumns: `minmax(50px, 1fr) repeat(${totalColSpan}, minmax(0, ${colWidth}px)) minmax(50px, 1fr)
            `,
            }}
        >
            {grid.rows.map((row: any, rowIndex: number, index: number) => {
                return row.columns.map((cell: any, cellIndex: number, index: number) => (
                    <div
                        key={index}
                        className="flex justify-stretch align-stretch"
                        style={cellPlacement({ ...cell, totalColSpan, cellIndex, rowIndex })}
                    >
                        <GridItem cell={cell} key={`grid-row-${rowIndex}-cell-${cellIndex}`} />
                    </div>
                ));
            })}
        </div>
    );
};
