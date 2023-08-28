import React from 'react';
import { useAppContext } from '../app-context/provider';
import { useLocalCart } from '../hooks/useLocalCart';
import Link from '~/bridge/ui/Link';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { CloneCartBtn } from '../components/clone-cart-button';

export default () => {
    const { isImmutable, clone: cartClone } = useLocalCart();
    const { path, _t } = useAppContext();
    const { loading } = useRemoteCart();

    return (
        <div className="lg:w-content mx-auto w-full min-h-[90vh] mt-14">
            <h1 className="text-3xl font-bold text-center mb-4">{_t('payment.cancelled')}</h1>
            <div className="flex mb-4 justify-between mx-auto w-fit">
                {loading && (
                    <div className="flex items-center">
                        <span className="pr-2">{_t('loading')}...</span>
                        <div className="loader" />
                    </div>
                )}
            </div>
            {isImmutable() && (
                <div className="mx-auto w-fit">
                    <CloneCartBtn />
                </div>
            )}
            {!isImmutable() && (
                <div className="flex gap-10 w-fit mx-auto">
                    <button
                        data-testid="go-to-cart-button"
                        className="bg-grey text-sm text-[#000] font-bold py-2 px-4 rounded-md"
                    >
                        <Link to={path('/cart')}>{_t('cart.goto')}</Link>
                    </button>
                    <button
                        data-testid="checkout-button"
                        className="bg-[#000] py-2 px-4 rounded-md text-[#fff] font-bold hover:bg-black-100 text-sm"
                    >
                        <Link to={path('/checkout')}>{_t('checkout')}</Link>
                    </button>
                </div>
            )}
        </div>
    );
};
