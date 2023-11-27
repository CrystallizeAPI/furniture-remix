'use client';
import React, { useEffect, useState } from 'react';
import BasketIcon from '~/assets/basketIcon.svg';
import { useLocalCart } from '../../hooks/useLocalCart';
import { useAppContext } from '../../app-context/provider';
import Link from '~/bridge/ui/Link';
import { ClientOnly } from '@crystallize/reactjs-hooks';

export const BasketButton = ({}) => {
    const { cart, isEmpty } = useLocalCart();
    const { path } = useAppContext();
    const [isClient, setIsClient] = useState(false);
    let quantity = 0;
    if (!isEmpty()) {
        quantity = Object.keys(cart.items).reduce((acc: number, key: string) => acc + cart.items[key].quantity, 0);
    }

    //resolve hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <Link to={path('/cart')} className="p-2 rounded-md hover:bg-[#efefef] relative">
            <img className="w-[30px] h-[30px]" src={`${BasketIcon}`} width="25" height="25" alt="Basket icon" />
            {isClient && (
                <ClientOnly>
                    <div className="absolute top-1 right-1 bg-[#ff0000] text-[#ffffff] w-[15px] h-[15px] rounded-full flex justify-center items-center text-[8px]">
                        {quantity}
                    </div>
                </ClientOnly>
            )}
        </Link>
    );
};
