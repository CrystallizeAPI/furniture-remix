import { useLocalBasket } from '~/core/hooks/useLocalBasket';
import { useEffect, useState } from 'react';
import { fetchHydratedBasket } from "~/core/UseCases";

export function useCart(): { loading: boolean, cart: any | null } {
    const { basket } = useLocalBasket();
    const [state, setState] = useState({
        loading: true,
        hydratedBasket: null,
    });
    useEffect(() => {
        (async () => {
            setState({
                ...state,
                loading: true
            });
            const hydratedBasket = await fetchHydratedBasket(basket);
            setState({
                ...state,
                loading: false,
                hydratedBasket: hydratedBasket
            });
        })();
    }, [basket]);

    return {
        loading: state.loading,
        cart: state.hydratedBasket
    }

}
