import * as React from 'react';
import { State, Dispatch, Actions, Reducer, mapToReducerActions } from './Reducer';
import { FunctionComponent } from 'react';
import { SuperFastConfig } from '../getSuperFast';

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState = (config: SuperFastConfig): State => {
    return {
        config
    };
};

export const SuperFastProvider: FunctionComponent<{
    children: React.ReactNode;
    config: SuperFastConfig;
}> = ({ config, children }) => {
    const [state, dispatch] = React.useReducer(
        Reducer,
        initialState(config),
    );
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useSuperFastState() {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useSuperFastState must be used within the MainProvider.');
    }
    return context;
}

function useSuperFastDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useSuperFastDispatch must be used within the MainProvider.');
    }
    return context;
}

export function useSuperFast(): { state: State; dispatch: Actions; } {
    const actions = mapToReducerActions(useSuperFastDispatch());
    const state = useSuperFastState();
    return {
        state,
        dispatch: actions,
    };
}
