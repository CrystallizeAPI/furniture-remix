import { Image } from '@crystallize/reactjs-components/dist/image';
import { Link } from '@remix-run/react';

export const Embed = ({ layout, item }: { layout: any; item: any }) => {
    let getComponentContent = (id: string) => {
        let component = item.components.find((component: any) => component.id === id);
        return component.content;
    };
    let embedItem = getComponentContent('media')?.selectedComponent?.content?.items[0];
    let title = getComponentContent('title')?.text;
    let description = getComponentContent('description')?.plainText?.[0];
    let color = `#${getComponentContent('background').selectedComponent?.content?.text}`;
    let media = embedItem?.components.find((component: any) => component.id === 'media')?.content?.selectedComponent
        ?.content;

    return (
        <Link to={embedItem.path} prefetch="intent">
            <div
                className="flex flex-col justify-between items-stretch h-full overflow-hidden"
                style={{ background: color }}
            >
                <div className="px-20 pt-20 h-1/3 ">
                    <h2 className="text-2xl font-bold mb-3">{title}</h2>
                    <p className="embed-text">{description}</p>
                </div>
                <div className="pl-10 pt-10 max-w-full h-full img-container img-cover grow">
                    <Image
                        {...media?.firstImage}
                        sizes="300px"
                        loading="lazy"
                        className="overflow-hidden rounded-tl-md "
                    />
                </div>
            </div>
        </Link>
    );
};
