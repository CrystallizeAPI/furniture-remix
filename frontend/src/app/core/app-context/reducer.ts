import { Action, Actions, Dispatch, State } from './types';

export function Reducer(state: State, action: Action) {
    switch (action.type) {
        case 'ADD_ITEMS_TO_CART': {
            return {
                ...state,
                latestAddedCartItems: action.items,
            };
        }
        case 'RESET_LAST_ADDED_ITEMS': {
            return {
                ...state,
                latestAddedCartItems: [],
            };
        }
        default: {
            throw new Error('AppContext - Unhandled action type');
        }
    }
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {
        addItemsToCart: (items: any[]) => dispatch({ type: 'ADD_ITEMS_TO_CART', items }),
        resetLastAddedItems() {
            dispatch({ type: 'RESET_LAST_ADDED_ITEMS' });
        },
    };
}
