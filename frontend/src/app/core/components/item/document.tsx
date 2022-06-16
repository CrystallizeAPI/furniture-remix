import { Image } from '@crystallize/reactjs-components';
import { ItemViewComponentProps } from '~/lib/grid-tile/types';
import { Link } from '@remix-run/react';
import { CuratedProduct } from './curated-product';

const DefaultDocument = ({ item }: { item: any }) => {
    const title = item?.components?.find((component: any) => component?.id === 'title')?.content?.text;
    const media = item?.components?.find((component: any) => component?.id === 'media')?.content?.selectedComponent
        ?.content;
    const description = item?.components?.find((component: any) => component?.id === 'description')?.content?.plainText;
    return (
        <div className="flex flex-col h-full justify-end">
            <div>
                <Image {...media?.images?.[0]} sizes="200px" loading="lazy" />
            </div>
            <div>{title}</div>
        </div>
    );
};
export const Document: React.FC<ItemViewComponentProps> = ({ item }) => {
    if (item.shape.identifier === 'curated-product-story') {
        return <CuratedProduct item={item} />;
    }
    return <DefaultDocument item={item} />;
};
