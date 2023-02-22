import { ChangeEvent, useState } from 'react';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { Input } from '../../components/input';
import { useAuth } from '../../hooks/useAuth';
import { useAppContext } from '../../app-context/provider';
import { Customer } from '~/use-cases/contracts/Customer';

export const AddressForm: React.FC<{ title: string; onValidSubmit: Function }> = ({ title, onValidSubmit }) => {
    const [isReadonly, setToReadonly] = useState(false);
    const { _t } = useAppContext();
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
                    {_t('hello')} {userInfos?.firstname} {userInfos?.lastname} (<strong>{userInfos?.email}</strong>),
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
                        label={_t('address.firstname')}
                        name="firstname"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />

                    <Input
                        defaultValue={customer.lastname || userInfos?.lastname}
                        placeholder={'Baggins'}
                        label={_t('address.lastname')}
                        name="lastname"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>
                <div className="mt-3">
                    <Input
                        defaultValue={customer.email || userInfos?.email}
                        label={_t('address.email')}
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
                        label={_t('address.streetAddress')}
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
                        label={_t('address.country')}
                        placeholder={'Middle Earth'}
                        name="country"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                    <Input
                        defaultValue={customer.city}
                        label={_t('address.city')}
                        placeholder={'Shire'}
                        name="city"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                    <Input
                        defaultValue={customer.zipCode}
                        label={_t('address.zipCode')}
                        placeholder={'3130'}
                        name="zipCode"
                        required
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>
                <div className="mt-3">
                    <Input
                        defaultValue={customer.additionalInfo}
                        label={_t('address.additionalInfo')}
                        placeholder={'Anything we should keep in mind before dispatching your order?'}
                        name="additionalInfo"
                        onChange={handleChange}
                        disabled={isReadonly}
                    />
                </div>
                {!isReadonly && (
                    <button
                        data-testid="checkout-next-step-button"
                        className="bg-black text-white rounded-md px-6 py-3 mt-5 float-right"
                        disabled={isReadonly}
                        type="submit"
                    >
                        {_t('address.next')}
                    </button>
                )}
            </form>
        </div>
    );
};
