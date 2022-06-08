import { Grid as BaseGrid } from '~/lib/grid-tile/grid';
import { Banner } from '~/core/components/grid-cells/views/banner';
import { Product } from '~/core/components/grid-cells/item/product';
import { Document } from '~/core/components/grid-cells/item/document';
import { Embed } from '~/core/components/grid-cells/views/embed';
import { Slider } from '~/core/components/grid-cells/views/slider';
import { useState } from 'react';
import { GridRenderingType } from '@crystallize/reactjs-components';

const titeMapping = {
    banner: Banner,
    embed: Embed,
    slider: Slider,
};
const itemMapping = {
    product: Product,
    document: Document,
};

export const Grid: React.FC<{ grid: any }> = ({ grid }) => {
    const [type, setType] = useState<GridRenderingType>(GridRenderingType.Div);

    const getTotalGridDimensions = (rows) => {
        const totalColSpan = rows[0].columns.reduce((acc, col) => acc + col.layout.colspan, 0);

        return totalColSpan;
    };
    const totalColumns = getTotalGridDimensions(grid.rows);
    const colWidth = Math.round(1600 / totalColumns);
    return (
        <>
            <div>
                <button
                    className="bg-textBlack text-[#fff] py-2 px-4 rounded-md"
                    onClick={() => setType(GridRenderingType.Div)}
                >
                    CSS Grid
                </button>
                <button
                    className="bg-textBlack text-[#fff] py-2 px-4 rounded-md ml-2"
                    onClick={() => setType(GridRenderingType.RowCol)}
                >
                    RowCol
                </button>
                <button
                    className="bg-textBlack text-[#fff] py-2 px-4 rounded-md ml-2"
                    onClick={() => setType(GridRenderingType.Table)}
                >
                    Table
                </button>
            </div>
            <div className="frntr-grid">
                {console.log({ grid })}
                <BaseGrid
                    grid={grid}
                    style={{
                        gridTemplateColumns: `minmax(50px, 1fr) repeat(${totalColumns}, minmax(0, ${colWidth}px)) minmax(50px, 1fr)`,
                    }}
                    itemComponentMapping={itemMapping}
                    tileViewComponentMapping={titeMapping}
                    type={type}
                    options={{
                        background: {
                            style: {
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                            },
                            imageProps: {
                                sizes: '(max-width: 500px) 300px, 700px',
                            },
                        },
                        style: {
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'contents',
                        },
                    }}
                />
            </div>
        </>
    );
};
