'use client';
import * as React from 'react';
import { createContext, FunctionComponent, useContext, useReducer } from 'react';
import { buildLanguageMarketAwareLink } from '~/use-cases/LanguageAndMarket';
import { mapToReducerActions, Reducer } from './reducer';
import { Actions, Dispatch, State } from './types';

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);
const TranslationsContext = createContext<Record<string, string> | undefined>(undefined);

type InitialState = Omit<State, 'latestAddedCartItems'>;

const initiateState = (initialState: InitialState): State => {
    return {
        ...initialState,
        latestAddedCartItems: [],
    };
};

export const AppContextProvider: FunctionComponent<{
    children: React.ReactNode;
    initialState: InitialState;
    translations: Record<string, string>;
}> = ({ children, initialState, translations }) => {
    const [state, dispatch] = useReducer(Reducer, initiateState(initialState));
    return (
        <TranslationsContext.Provider value={translations}>
            <StateContext.Provider value={state}>
                <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
            </StateContext.Provider>
        </TranslationsContext.Provider>
    );
};

function useAppContextState() {
    const context = useContext(StateContext);
    if (context === undefined) {
        throw new Error('useAppContextState must be used within the AppContextProvider.');
    }
    return context;
}

function useAppContextDispatch() {
    const context = useContext(DispatchContext);
    if (context === undefined) {
        throw new Error('useAppContextDispatch must be used within the AppContextProvider.');
    }
    return context;
}

export function useAppContext(): {
    state: State;
    dispatch: Actions;
    path: (path: string) => string;
    _t: (key: string, options?: Record<string, any>) => string;
} {
    const translationContext = useContext(TranslationsContext);
    const actions = mapToReducerActions(useAppContextDispatch());
    const state = useAppContextState();

    const translate = (key: string, options?: Record<string, any>): string => {
        if (!translationContext) {
            return key;
        }
        const translated = translationContext[key as keyof typeof translationContext] || key;
        if (!options) {
            return translated;
        }

        return Object.entries(options).reduce((acc, [key, value]) => {
            return acc.replace(`{{${key}}}`, value);
        }, translated);
    };

    return {
        state,
        dispatch: actions,
        _t: translate,
        path: (path: string) => buildLanguageMarketAwareLink(path, state.language, state.market),
    };
}
