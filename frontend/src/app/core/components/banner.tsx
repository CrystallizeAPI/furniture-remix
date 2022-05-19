import { Image } from '@crystallize/reactjs-components/dist/image';

export const Banner = ({ cell }: { cell: any }) => {
    let components = cell?.item?.components;
    let title = components?.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = components?.find((component: any) => component.type === 'richText')?.content?.plainText?.[0];
    let image = components?.find((component: any) => component.id === 'media')?.content?.selectedComponent?.content
        ?.images?.[0];
    let cta = components?.find((component: any) => component.id === 'cta')?.content?.chunks?.[0];
    let color = `#${
        components?.find((component: any) => component.id === 'background')?.content?.selectedComponent?.content?.text
    }`;
    let isFullWidth = components?.find((component: any) => component.id === 'fullwidth-tile')?.content?.value;

    return (
        <div
            className={`flex h-[470px] overflow-hidden ${cell.layout.colspan === 3 ? 'flex-row' : 'flex-col'}`}
            style={{ background: color }}
        >
            <div className={`${cell.layout.colspan === 3 ? 'w-2/4' : 'w-5/5'} px-10 pt-10`}>
                <h1 className={`${title === 'SALE' ? 'text-9xl' : 'text-2xl'} font-bold mb-3`}>{title}</h1>
                <p className={`mt-5 mb-5 ${cell.layout.colspan === 3 ? 'w-3/4' : 'w-5/5'}`}>{description}</p>
                {cta ? <button className="bg-ctaBlue px-5 py-2 rounded">{cta[1]?.content?.text}</button> : null}
            </div>
            <div className="self-end">
                <Image {...image} sizes="100w, 700px" />
            </div>
        </div>
    );
};
