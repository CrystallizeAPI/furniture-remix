import { ProductVariant } from '@crystallize/js-api-client';
import { StoreFrontConfiguration } from '../contract/StoreFrontConfiguration';

export type Action = { type: 'ADD_ITEMS_TO_CART'; items: any[] } | { type: 'RESET_LAST_ADDED_ITEMS' };

export type Actions = {
    addItemsToCart: (items: ProductVariant[]) => void;
    resetLastAddedItems: () => void;
};
export type Dispatch = (action: Action) => void;

export type State = StoreFrontConfiguration & {
    latestAddedCartItems: any[];
};
