import { Action, Actions, Dispatch, State } from './types';

export function Reducer(state: State, action: Action) {
    return {
        ...state,
    };
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {};
}
