import { ItemViewComponentProps } from '../../lib/grid-tile/types';

export const GenericItem: React.FC<ItemViewComponentProps> = ({ item }) => {
    return (
        <div className={`crystallize-generic-item`}>
            <a href={item.path}>{item.name ?? ''}</a>
        </div>
    );
};
