import { useLocalCart } from '~/core/hooks/useLocalCart';
import { useEffect, useState } from 'react';
import { useFetchResult } from 'node_modules/@crystallize/reactjs-hooks';

export function useRemoteCart(): { loading: boolean, remoteCart: any | null } {
    const { cart, setWrappingData } = useLocalCart();
    const { post, abort } = useFetchResult();
    const [state, setState] = useState({
        loading: true,
        hydratedCart: null,
    });
    useEffect(() => {
        (async () => {
            setState({
                ...state,
                loading: true
            });
            //@ts-ignore
            const cartWrapper = await post<any>(window.ENV.SERVICE_API_URL + '/cart', {
                locale: 'en',
                items: Object.values(cart.items),
                cartId: cart.cartId,
                withImages: true
            });
            if ((cart.cartId !== cartWrapper.cartId) || (cart.state !== cartWrapper.state)) {
                setWrappingData(cartWrapper.cartId, cartWrapper.state);
            };
            setState({
                ...state,
                loading: false,
                hydratedCart: cartWrapper
            });
        })();
        return () => {
            abort();
        }
    }, [cart]);

    return {
        loading: state.loading,
        remoteCart: state.hydratedCart
    }

}
