import { ProductVariant } from '../../use-cases/contracts/ProductVariant';
import { StoreFrontConfiguration } from '../../use-cases/contracts/StoreFrontConfiguration';

export type Action = { type: 'ADD_ITEMS_TO_CART'; items: any[] } | { type: 'RESET_LAST_ADDED_ITEMS' };

export type Actions = {
    addItemsToCart: (items: ProductVariant[]) => void;
    resetLastAddedItems: () => void;
};
export type Dispatch = (action: Action) => void;

export type State = StoreFrontConfiguration & {
    latestAddedCartItems: ProductVariant[];
};
