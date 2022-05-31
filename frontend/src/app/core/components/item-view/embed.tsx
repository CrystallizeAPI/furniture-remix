import { Image } from '@crystallize/reactjs-components/dist/image';

export const Embed = ({ layout, item }: { layout: any; item: any }) => {
    let embedItem = item?.components.find((component: any) => component.id === 'media')?.content?.selectedComponent
        ?.content?.items[0];
    let title = embedItem?.components.find((component: any) => component.id === 'title')?.content?.text;
    let description = embedItem?.components.find((component: any) => component.id === 'description')?.content
        ?.plainText?.[0];
    let color = `#${
        item?.components?.find((component: any) => component.id === 'background')?.content?.selectedComponent?.content
            ?.text
    }`;
    let media = embedItem?.components.find((component: any) => component.id === 'media')?.content?.selectedComponent
        ?.content;
    return (
        <div
            className="flex flex-col justify-between items-stretch h-full overflow-hidden"
            style={{ background: color }}
        >
            <div className="px-20 pt-20 h-1/3 ">
                <h2 className="text-2xl font-bold mb-3">{title}</h2>
                <p className="embed-text">{description}</p>
            </div>
            <div className="pl-10 pt-10 max-w-full h-full img-container img-cover grow">
                <Image {...media?.firstImage} sizes="100vw" className="overflow-hidden rounded-tl-md " />
            </div>
        </div>
    );
};
