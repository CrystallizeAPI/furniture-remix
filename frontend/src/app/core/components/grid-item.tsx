import { Banner } from './item-view/banner';
import { GridDocument } from './item-view/document';
import { Embed } from './item-view/embed';
import { GridProduct } from './item-view/product';
import { Slider } from './item-view/slider';

export const GridItem = ({ cell }: { cell: any }) => {
    let view = cell?.item?.components?.find((component: any) => component?.id === 'view')?.content?.options?.[0]?.value;
    let type = cell?.item?.type;
    let color = `#${
        cell?.item?.components?.find((component: any) => component.id === 'background')?.content?.selectedComponent
            ?.content?.text
    }`;

    const tiles = {
        banner: <Banner layout={cell.layout} item={cell.item} />,
        slider: <Slider layout={cell.layout} item={cell.item} />,
        embed: <Embed layout={cell.layout} item={cell.item} />,
    };
    const itemTypes = {
        product: <GridProduct layout={cell.layout} item={cell?.item} />,
        document: <GridDocument item={cell?.item} />,
    };

    return (
        <div
            style={{
                background: color,
                gridColumnStart: `span ${cell.layout.colspan}`,
            }}
        >
            {view ? tiles[view as keyof typeof tiles] : itemTypes[type as keyof typeof itemTypes]}
        </div>
    );
};
