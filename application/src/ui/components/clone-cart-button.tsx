import React from 'react';
import { useAppContext } from '../app-context/provider';
import { useLocalCart } from '../hooks/useLocalCart';

export const CloneCartBtn: React.FC = () => {
    const { clone: cartClone } = useLocalCart();
    const { _t } = useAppContext();
    return (
        <>
            <p className="text-red-500">{_t('cart.immutable')}</p>
            <button
                className="my-3 bg-[#000] border px-5 py-3 relative overflow-hidden h-[50px] rounded-md text-[#fff] w-full font-bold hover:bg-black-100 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(event) => {
                    event.preventDefault();
                    cartClone();
                }}
            >
                {_t('cart.clone')}
            </button>
        </>
    );
};
