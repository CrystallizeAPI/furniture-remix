import { GridItem } from '~/core/components/grid-item';

const getTotalGridDimensions = (rows: any) => {
    const totalColSpan = rows[0].columns.reduce((acc: any, col: any) => acc + col.layout.colspan, 0);

    return totalColSpan;
};

export const Grid = ({ grid }: { grid: any }) => {
    const totalColSpan = getTotalGridDimensions(grid.rows);
    return (
        <div className="frntr-grid auto-rows-auto gap-3">
            {grid.rows.map((row: any, rowIndex: number) => {
                let isFullWidth;
                // A workaround to make the fullwidth tiles work properly
                if (row.columns.length < 2) {
                    isFullWidth = row.columns?.[0].item?.components?.find(
                        (component: any) => component.id === 'fullwidth-tile',
                    )?.content?.value;
                }
                return (
                    <div
                        className="grid max-w-full gap-3"
                        style={{
                            gridColumnStart: isFullWidth ? 'span 3' : 2,
                            gridTemplateColumns: `repeat(${totalColSpan}, 1fr)`,
                        }}
                        key={`grid-row-${rowIndex}`}
                    >
                        {row.columns.map((cell: any, cellIindex: number) => (
                            <GridItem cell={cell} key={`grid-row-${rowIndex}-cell-${cellIindex}`} />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
