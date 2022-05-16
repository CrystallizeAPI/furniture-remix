import { SuperFastConfig } from "../getSuperFast";

type Action = {};
export type Actions = {};
export type Dispatch = (action: Action) => void;

export type State = {
    config: SuperFastConfig;
};

export function Reducer(state: State, action: Action) {
    return {
        ...state,
    };
}

export function mapToReducerActions(dispatch: Dispatch): Actions {
    return {};
}
