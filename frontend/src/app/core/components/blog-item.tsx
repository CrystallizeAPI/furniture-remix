import { Link } from '@remix-run/react';
import { Image } from '@crystallize/reactjs-components/dist/image';

export const BlogItem = ({ item }: { item: any }) => {
    let title = item.components.find((component: any) => component.id === 'title')?.content?.text;
    let description = item.components.find((component: any) => component.id === 'description')?.content?.plainText;
    let media = item?.components.find((component: any) => component.id === 'media')?.content?.selectedComponent
        ?.content;
    return (
        <div className="rounded-lg overflow-hidden img-cover-hover">
            <Link to={item.path} prefetch="intent">
                <div className="img-container img-cover aspect-square rounded-md overflow-hidden">
                    <Image {...media?.images?.[0]} sizes="300px" loading="lazy" />
                </div>
                <div className="pt-7 pb-10 relative">
                    <h2 className="font-semibold text-3xl">{title}</h2>
                    <div className="my-2 text-md leading-[1.8em]">{description}</div>
                </div>
            </Link>
        </div>
    );
};
