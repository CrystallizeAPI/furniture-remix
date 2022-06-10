import { Image } from '@crystallize/reactjs-components';
import { ItemViewComponentProps } from '../../../../lib/grid-tile/types';

export const Document: React.FC<ItemViewComponentProps> = ({ item }) => {
    let title = item?.components?.find((component: any) => component?.id === 'title')?.content?.text;
    let media = item?.components?.find((component: any) => component?.id === 'media')?.content?.selectedComponent
        ?.content;
    return (
        <div className="flex flex-col h-full justify-end">
            <div>
                <Image {...media?.images?.[0]} sizes="200px" loading="lazy" />
            </div>
            <div>{title}</div>
        </div>
    );
};
