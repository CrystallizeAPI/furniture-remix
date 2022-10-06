import { ProductVariant } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import { Currency } from '~/lib/pricing/currencies';

export type Action = { type: 'ADD_ITEMS_TO_CART'; items: any[] } | { type: 'RESET_LAST_ADDED_ITEMS' };

export type Actions = {
    addItemsToCart: (items: ProductVariant[]) => void;
    resetLastAddedItems: () => void;
};
export type Dispatch = (action: Action) => void;

export type State = {
    currency: Currency;
    locale: string; // would handle the Price format, Date format and the language
    country: string; // would be the delivery country
    latestAddedCartItems: any[];
    config: TStoreFrontConfig;
};
