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
    const [type, setType] = useState<GridRenderingType>(GridRenderingType.RowCol);

    return (
        <>
            <div>
                <p>Just for you Didrik to easily swith the rendering and pick the best one</p>
                <p>It almost invisible but it changes the html structure</p>
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
            <BaseGrid
                grid={grid}
                itemComponentMapping={itemMapping}
                tileViewComponentMapping={titeMapping}
                type={type}
                options={{
                    background: {
                        style: {
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        },
                        imageProps: {
                            sizes: '(max-width: 500px) 300px, 700px',
                            // loading: "lazy"
                        },
                    },
                    style: {
                        position: 'relative',
                        width: '100%',
                    },
                }}
            />
        </>
    );
};
