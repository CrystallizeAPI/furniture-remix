import { ChangeEvent, useState } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { Input } from '~/core/components/input';
import { useAuth } from '~/core/hooks/useAuth';

export type Customer = {
    firstname: string;
    lastname: string;
    email: string;
    streetAddress: string;
    city: string;
    zipCode: string;
    country: string;
};

export const AddressForm: React.FC<{ title: string; onValidSubmit: Function }> = ({ title, onValidSubmit }) => {
    const [isReadonly, setToReadonly] = useState(false);
    const { isAuthenticated, userInfos } = useAuth();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {
        email: userInfos?.email,
        firstname: userInfos?.firstname,
        lastname: userInfos?.lastname,
    });
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        writeStorage('customer', {
            ...customer,
            [event.target.name]: event.target.value.trim(),
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <h1 className="font-bold text-2xl mt-5 mb-3">{title}</h1>
            {isAuthenticated && (
                <p>
                    Hello {userInfos?.firstname} {userInfos?.lastname} (<strong>{userInfos?.email}</strong>),
                </p>
            )}
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    setToReadonly(true);
                    onValidSubmit();
                    return false;
                }}
            >
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        defaultValue={customer.firstname || userInfos?.firstname}
                        placeholder={'Frodo'}
                        label="First name"
                        name="firstname"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />

                    <Input
                        defaultValue={customer.lastname || userInfos?.lastname}
                        placeholder={'Baggins'}
                        label="Last name"
                        name="lastname"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>
                <div className="mt-3">
                    <Input
                        defaultValue={customer.email || userInfos?.email}
                        label="Email"
                        placeholder={'Frodo.ringmaster@shireclub.com'}
                        name="email"
                        required
                        type="email"
                        onChange={handleChange}
                        disabled={isReadonly}
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
                        disabled={isReadonly}
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
                        disabled={isReadonly}
                    />
                    <Input
                        defaultValue={customer.city}
                        label="City"
                        placeholder={'Shire'}
                        name="city"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                    <Input
                        defaultValue={customer.zipCode}
                        label="Zip code"
                        placeholder={'3130'}
                        name="zipCode"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>
                {!isReadonly && (
                    <button
                        className="bg-[#000] text-[#fff] rounded-md px-3 py-2 mt-5 float-right"
                        disabled={isReadonly}
                        type="submit"
                    >
                        Next
                    </button>
                )}
            </form>
        </div>
    );
};
