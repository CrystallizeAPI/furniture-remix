import * as React from 'react';
import { FunctionComponent } from 'react';
import { getCurrencyFromCode } from '~/lib/pricing/currencies';
import { mapToReducerActions, Reducer } from './reducer';
import { Actions, Dispatch, State } from './types';

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState = (): State => {
    return {
        locale: 'en-US', // not relevant for now
        currency: getCurrencyFromCode('EUR'),
        country: 'US', // not relevant for now
        latestAddedCartItems: [],
    };
};

export const AppContextProvider: FunctionComponent<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [state, dispatch] = React.useReducer(Reducer, initialState());
    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StateContext.Provider>
    );
};

function useAppContextState() {
    const context = React.useContext(StateContext);
    if (context === undefined) {
        throw new Error('useAppContextState must be used within the AppContextProvider.');
    }
    return context;
}

function useAppContextDispatch() {
    const context = React.useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useAppContextDispatch must be used within the AppContextProvider.');
    }
    return context;
}

export function useAppContext(): { state: State; dispatch: Actions } {
    const actions = mapToReducerActions(useAppContextDispatch());
    const state = useAppContextState();
    return {
        state,
        dispatch: actions,
    };
}
