'use client';

import { useLocalCart } from '../hooks/useLocalCart';
import { useEffect, useState } from 'react';
import { useAppContext } from '../app-context/provider';
import { ServiceAPI } from '~/use-cases/service-api';
import { RemoteCart } from '~/use-cases/contracts/RemoteCart';

export function useRemoteCart(): RemoteCart {
    const { cart, setWrappingData } = useLocalCart();
    const { state: appContextState } = useAppContext();
    const [state, setState] = useState({
        loading: true,
        hydratedCart: null,
    });

    useEffect(() => {
        (async () => {
            setState({
                ...state,
                loading: true,
            });
            const api = ServiceAPI({
                language: appContextState.language,
                serviceApiUrl: appContextState.serviceApiUrl,
            });
            const cartWrapper = await api.fetchRemoteCart(cart);
            if (cart.cartId !== cartWrapper.id || cart.state !== cartWrapper.state) {
                setWrappingData(cartWrapper.id, cartWrapper.state);
            }
            setState({
                ...state,
                loading: false,
                hydratedCart: cartWrapper,
            });
        })();
    }, [cart]);

    return {
        loading: state.loading,
        remoteCart: state.hydratedCart,
    };
}
