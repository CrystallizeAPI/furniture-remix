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
            let resolvedFrom: string;
            const updateCartInfo = (cartInfo: any, from: string) => {
                if (resolvedFrom === 'fetchRemoteCart') {
                    return;
                }
                resolvedFrom = from;
                if (cart.cartId !== cartInfo.id || cart.state !== cartInfo.state) {
                    setWrappingData(cartInfo.id, cartInfo.state);
                }
                setState({
                    ...state,
                    loading: false,
                    hydratedCart: cartInfo,
                });
            };

            if (cart.cartId) {
                api.fetchCart(cart.cartId).then((info) => updateCartInfo(info, 'fetchCart'));
            }
            api.fetchRemoteCart(cart).then((info) => updateCartInfo(info, 'fetchRemoteCart'));
        })();
    }, [cart]);

    return {
        loading: state.loading,
        remoteCart: state.hydratedCart,
    };
}
