import { GridItem } from '~/core/components/grid-item';

const getTotalGridDimensions = (rows) => {
    const totalColSpan = rows[0].columns.reduce((acc, col) => acc + col.layout.colspan, 0);

    return totalColSpan;
};

export const Grid = ({ grid }: { grid: any }) => {
    const totalColSpan = getTotalGridDimensions(grid.rows);
    console.log({ grid });
    return (
        <div className="frntr-grid auto-rows-auto gap-3">
            {grid.rows.map((row) => {
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
                    >
                        {row.columns.map((cell) => (
                            <GridItem cell={cell} />
                        ))}
                    </div>
                );
            })}
        </div>
    );
};
