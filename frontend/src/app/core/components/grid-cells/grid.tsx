import { Grid as BaseGrid } from '~/lib/grid-tile/grid';
import { Banner } from '~/core/components/grid-cells/views/banner';
import { Product } from '~/core/components/grid-cells/item/product';
import { Document } from '~/core/components/grid-cells/item/document';
import { Embed } from '~/core/components/grid-cells/views/embed';
import { Slider } from '~/core/components/grid-cells/views/slider';
import { GridPositionnable, GridRenderingType } from '@crystallize/reactjs-components';

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
    const totalColumns = grid.rows[0].columns.reduce((acc: number, col: any) => acc + col.layout.colspan, 0);
    const colWidth = Math.round(1600 / totalColumns);

    const styleForCell = (cell: any, positionInfos: GridPositionnable, styles: React.CSSProperties) => {
        if (!cell.item) {
            return styles;
        }
        const component = cell.item.components.find((component: any) => component.id === 'styling');
        if (!component) {
            return styles;
        }
        const isFullWidth = component?.content?.chunks[0]?.find((chunk: any) => chunk.id === 'use-full-width').content
            ?.value;
        if (!isFullWidth) {
            return styles;
        }
        return {
            ...styles,
            gridColumn: isFullWidth ? '1 / span 5' : '2 / span 3',
        };
    };

    return (
        <div className="frntr-grid">
            <BaseGrid
                grid={grid}
                itemComponentMapping={itemMapping}
                tileViewComponentMapping={titeMapping}
                type={GridRenderingType.Div}
                styleForCell={styleForCell}
                style={{
                    gridTemplateColumns: `minmax(50px, 1fr) repeat(${totalColumns}, minmax(0, ${colWidth}px)) minmax(50px, 1fr)`,
                }}
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
                            loading: 'lazy',
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
    );
};
