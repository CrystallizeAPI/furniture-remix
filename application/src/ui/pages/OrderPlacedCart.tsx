'use client';

import { useEffect, useState } from 'react';
import { useLocalCart } from '../hooks/useLocalCart';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '../app-context/provider';
import useNavigate from '~/bridge/ui/useNavigate';

export default ({ cartId }: { cartId: string }) => {
    const { cart: localCart, empty } = useLocalCart();
    const [tryCount, setTryCount] = useState(0);
    const { state: appContextState, path, _t } = useAppContext();
    const navigate = useNavigate();

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                if (localCart.cartId === cartId) {
                    empty();
                }
                const cart = await ServiceAPI({
                    language: appContextState.language,
                    serviceApiUrl: appContextState.serviceApiUrl,
                }).fetchCart(cartId);

                if (cart?.extra?.orderId) {
                    if (cart?.customer?.isGuest === true) {
                        navigate(path('/order/' + cart.extra.orderId + '?cartId=' + cart.cartId));
                    } else {
                        navigate(path('/order/' + cart.extra.orderId));
                    }
                } else {
                    timeout = setTimeout(() => {
                        setTryCount(tryCount + 1);
                    }, 500 * tryCount);
                }
            } catch (exception) {
                timeout = setTimeout(() => {
                    setTryCount(tryCount + 1);
                }, 500 * tryCount);
            }
        })();
        return () => clearTimeout(timeout);
    }, [cartId, tryCount]);

    return (
        <div className="items-center justify-center flex max-w-[500px] mx-auto flex-row">
            <div className="loader mr-3" />
            {_t('order.redirectMessage')}
        </div>
    );
};
