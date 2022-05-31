import { ChangeEvent, useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { Payments } from '../payments';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

export type Guest = {
    firstname: string;
    lastname: string;
    email: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    country: string;
};

export const GuestCheckoutForm: React.FC = () => {
    const { cart } = useLocalCart();
    const [customer] = useLocalStorage<Partial<Guest>>('customer', {});
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        writeStorage('customer', {
            ...customer,
            [event.target.name]: event.target.value.trim(),
        });
    };

    return (
        <div className="flex flex-col gap-3 w-3/5 mt-3">
            <h1 className="font-bold text-2xl mt-5 mb-5">Guest Checkout</h1>
            <form>
                <div className="flex gap-3">
                    <input
                        defaultValue={customer.firstname}
                        type={'firstname'}
                        placeholder={'Frodo'}
                        name="firstname"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        onChange={handleChange}
                    />
                    <input
                        defaultValue={customer.lastname}
                        type={'lastname'}
                        placeholder={'Baggins'}
                        name="lastname"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        onChange={handleChange}
                    />
                </div>
                <input
                    defaultValue={customer.email}
                    type={'email'}
                    placeholder={'Frodo.ringmaster@shireclub.com'}
                    name="email"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    onChange={handleChange}
                />
                <input
                    defaultValue={customer.streetAddress}
                    type={'text'}
                    placeholder={'Shire'}
                    name="streetAddress"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                    onChange={handleChange}
                />
                <div className="flex gap-3">
                    <input
                        defaultValue={customer.country}
                        type={'text'}
                        placeholder={'Middle Earth'}
                        name="country"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        onChange={handleChange}
                    />
                    <input
                        defaultValue={customer.city}
                        type={'text'}
                        placeholder={'City'}
                        name="city"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        defaultValue={customer.zipCode}
                        type={'text'}
                        placeholder={'3130'}
                        name="zipCode"
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                        onChange={handleChange}
                    />
                </div>
            </form>
            {cart.cartId !== '' && <Payments isGuest={true} />}
        </div>
    );
};
