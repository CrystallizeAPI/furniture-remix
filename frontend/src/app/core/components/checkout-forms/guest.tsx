import { ChangeEvent, useState } from 'react';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { Payments } from '../payments';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { Input } from '~/core/components/input';

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
        <div className="flex flex-col gap-3">
            <h1 className="font-bold text-2xl mt-5 mb-3">Guest Checkout</h1>
            <form>
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        defaultValue={customer.firstname}
                        placeholder={'Frodo'}
                        label="First name"
                        name="firstname"
                        required
                        onChange={handleChange}
                    />

                    <Input
                        defaultValue={customer.lastname}
                        placeholder={'Baggins'}
                        label="Last name"
                        name="lastname"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-3">
                    <Input
                        defaultValue={customer.email}
                        label="Email"
                        placeholder={'Frodo.ringmaster@shireclub.com'}
                        name="email"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-3">
                    <Input
                        defaultValue={customer.streetAddress}
                        label="Street Address"
                        placeholder={'6th hole from the Brandybuck Family'}
                        name="streetAddress"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-3">
                    <Input
                        defaultValue={customer.country}
                        label="Country"
                        placeholder={'Middle Earth'}
                        name="country"
                        required
                        onChange={handleChange}
                    />
                    <Input
                        defaultValue={customer.city}
                        label="City"
                        placeholder={'Shire'}
                        name="city"
                        required
                        onChange={handleChange}
                    />
                    <Input
                        defaultValue={customer.zipCode}
                        label="Zip code"
                        placeholder={'3130'}
                        name="zipCode"
                        required
                        onChange={handleChange}
                    />
                </div>
            </form>
            {cart.cartId !== '' && <Payments isGuest={true} />}
        </div>
    );
};
