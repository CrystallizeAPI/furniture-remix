import { Grid as BaseGrid } from '~/lib/grid-tile/grid';
import { Banner } from '~/core/components/grid-cells/views/banner';
import { Product } from '~/core/components/grid-cells/item/product';
import { Document } from '~/core/components/grid-cells/item/document';
import { Embed } from '~/core/components/grid-cells/views/embed';
import { Slider } from '~/core/components/grid-cells/views/slider';

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
    return <BaseGrid grid={grid} itemComponentMapping={itemMapping} tileViewComponentMapping={titeMapping} />;
};
