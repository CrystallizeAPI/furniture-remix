import { Banner } from './item-view/banner';
import { GridDocument } from './item-view/document';
import { Embed } from './item-view/embed';
import { GridProduct } from './item-view/product';
import { Slider } from './item-view/slider';

export const GridItem = ({ cell }: { cell: any }) => {
    let view = cell?.item?.components?.find((component: any) => component?.id === 'view')?.content?.options?.[0]?.value;
    let type = cell?.item?.type;
    let isFullWidth = cell?.item?.components?.find((component: any) => component?.id === 'fullwidth-tile')?.content
        ?.value;
    let color = `#${
        cell?.item?.components?.find((component: any) => component.id === 'background')?.content?.selectedComponent
            ?.content?.text
    }`;
    console.log({ cell });
    console.log({ isFullWidth });
    return (
        <div
            style={{
                background: color,
                gridColumnStart: `span ${cell.layout.colspan}`,
            }}
        >
            {/* <div className={`${cell.layout.rowspan === 1 && isFullWidth ? 'w-full' : 'mx-10'}`}> */}
            {view === 'banner' && <Banner layout={cell.layout} item={cell.item} />}
            {view === 'slider' && <Slider layout={cell.layout} item={cell.item} />}
            {view === 'embed' && <Embed layout={cell.layout} item={cell.item} />}
            {type === 'product' && <GridProduct item={cell?.item} />}
            {type === 'document' && <GridDocument item={cell?.item} />}
        </div>
    );
};
