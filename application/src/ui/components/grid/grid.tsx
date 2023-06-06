'use client';

import { Grid as BaseGrid } from '../../lib/grid-tile/grid';
import { ProductFromCell } from '../../components/item/product';
import { DocumentFromCell } from '../../components/item/document';
import { Banner } from '../../components/grid/tiles/banner';
import { Embed } from '../../components/grid/tiles/embed';
import { Slider } from '../../components/grid/tiles/slider';
import { GridCell, GridRenderingType } from '@crystallize/reactjs-components';
import { HeroSlider } from './tiles/hero-slider';

const tileMapping = {
    banner: Banner,
    embed: Embed,
    slider: Slider,
    heroslider: HeroSlider,
};
const itemMapping = {
    product: ProductFromCell,
    document: DocumentFromCell,
};

export const Grid: React.FC<{ grid: any }> = ({ grid }) => {
    if ((grid?.rows?.length || 0) === 0) {
        return null;
    }
    const totalColumns = grid.rows[0].columns.reduce((acc: number, col: any) => acc + col.layout.colspan, 0);
    const colWidth = Math.round(1530 / totalColumns);

    const styleForCell = (cell: GridCell, styles: React.CSSProperties) => {
        if (!cell?.item) {
            return styles;
        }

        const component = cell.item.components.find((component: any) => component.id === 'styling');
        if (!component) {
            return {
                ...styles,
                gridColumn: `${cell.layout.colIndex + 2} / span ${cell.layout.colspan}`,
                gridRow: `${cell.layout.rowIndex + 1} / span ${cell.layout.rowspan}`,
            };
        }
        const isFullWidth = component?.content?.chunks[0]?.find((chunk: any) => chunk.id === 'use-full-width')?.content
            ?.value;

        if (!isFullWidth) {
            return {
                ...styles,
                gridColumn: `${cell.layout.colIndex + 2} / span ${cell.layout.colspan}`,
                gridRow: `${cell.layout.rowIndex + 1} / span ${cell.layout.rowspan}`,
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
                tileViewComponentMapping={tileMapping}
                type={GridRenderingType.Div}
                styleForCell={styleForCell}
                style={{
                    gridTemplateColumns: `minmax(15px, 1fr) repeat(${totalColumns}, minmax(0, ${colWidth}px)) minmax(15px, 1fr)`,
                    gridAutoRows: 'minmax(300px, auto)',
                }}
                options={{
                    background: {
                        style: {
                            objectFit: 'cover',
                        },
                        imageProps: {
                            sizes: '(max-width: 500px) 500px, 100vw',
                            loading: 'lazy',
                        },
                    },
                    style: {
                        position: 'relative',
                        width: '100%',
                        zIndex: 20,
                        minHeight: '100%',
                        display: 'flex',
                        alignItems: 'stretch',
                        justifyContent: 'stretch',
                    },
                }}
            />
        </div>
    );
};
