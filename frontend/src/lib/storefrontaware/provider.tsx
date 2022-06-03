import { ClientInterface, createClient } from '@crystallize/js-api-client';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { mapToReducerActions, Reducer } from './reducer';
import { Actions, Dispatch, State, TStoreFrontConfig } from './types';

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState = (config: TStoreFrontConfig): State => {
    return {
        config,
    };
};

export const StoreFrontConfigProvider: FunctionComponent<{
    children: React.ReactNode;
    config: TStoreFrontConfig;
}> = ({ config, children }) => {
    const [state, dispatch] = React.useReducer(Reducer, initialState(config));
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useStoreFrontState() {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useStoreFrontState must be used within the MainProvider.');
    }
    return context;
}

function useStoreFrontDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useStoreFrontDispatch must be used within the MainProvider.');
    }
    return context;
}

export function useStoreFront(): { state: State; dispatch: Actions; apiClient: ClientInterface } {
    const actions = mapToReducerActions(useStoreFrontDispatch());
    const state = useStoreFrontState();
    return {
        state,
        dispatch: actions,
        apiClient: createClient({ tenantIdentifier: state.config.tenantIdentifier }),
    };
}
