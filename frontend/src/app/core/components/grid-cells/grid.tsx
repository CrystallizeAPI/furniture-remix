import { Grid as BaseGrid } from '~/lib/grid-tile/grid';
import { Product } from '~/core/components/item/product';
import { Document } from '~/core/components/item/document';
import { Banner } from '~/core/components/tiles/banner';
import { Embed } from '~/core/components/tiles/embed';
import { Slider } from '~/core/components/tiles/slider';
import { GridCell, GridRenderingType } from '@crystallize/reactjs-components';

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

    const styleForCell = (cell: GridCell, styles: React.CSSProperties) => {
        if (!cell?.item) {
            return styles;
        }

        const component = cell.item.components.find((component: any) => component.id === 'styling');
        if (!component) {
            return styles;
        }
        const isFullWidth = component?.content?.chunks[0]?.find((chunk: any) => chunk.id === 'use-full-width')?.content
            ?.value;
        if (!isFullWidth) {
            return {
                ...styles,
                gridColumn: `${cell.position.colIndex + 2} / span ${cell.layout.colspan}`,
                gridRow: `${cell.position.rowIndex + 1} / span ${cell.layout.rowspan}`,
            };
        }
        return {
            ...styles,
            gridColumn: `1 / span ${totalColumns + 2}`,
            gridRow: `auto / span ${cell.layout.rowspan}`,
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
                        minHeight: '100%',
                        display: 'flex',
                    },
                }}
            />
        </div>
    );
};
