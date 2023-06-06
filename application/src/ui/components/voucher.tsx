'use client';

import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useState } from 'react';
import { useAppContext } from '../app-context/provider';
import { useLocalCart } from '../hooks/useLocalCart';
import { useRemoteCart } from '../hooks/useRemoteCart';
import { Input } from './input';

export const VoucherForm: React.FC = () => {
    const { cart: localCart, setVoucher } = useLocalCart();
    const { loading } = useRemoteCart();
    const [voucherValue, setVoucherValue] = useState(localCart?.extra?.voucher ?? '');
    const { _t } = useAppContext();

    return (
        <ClientOnly>
            <div className="flex flex-col w-full">
                <Input
                    type="text"
                    name="voucher"
                    label="Coupon Code"
                    placeholder={_t('cart.voucherCode')}
                    onChange={(event) => {
                        setVoucherValue(event.target.value);
                    }}
                    value={voucherValue}
                />
                <div className="flex gap-2 items-end">
                    <button
                        type="button"
                        disabled={loading}
                        className="bg-[#000] text-[#fff] px-2 py-1 rounded mt-5 text-center h-10"
                        onClick={() => {
                            setVoucher(voucherValue);
                        }}
                    >
                        {loading && localCart?.extra?.voucher ? _t('loading') : _t('cart.useVoucher')}
                    </button>
                    {!loading && voucherValue !== '' && (
                        <button
                            type="button"
                            className="bg-grey py-2 px-5 rounded-md text-center"
                            onClick={() => {
                                setVoucherValue('');
                                setVoucher('');
                            }}
                        >
                            {_t('delete')}
                        </button>
                    )}
                </div>
            </div>
        </ClientOnly>
    );
};
