import { ChangeEvent, FormEvent, useState } from 'react';
import { ServiceAPI } from '~/core/use-cases/service-api';

export const RegisterCheckoutForm: React.FC<{ enabledGuest: Function }> = ({ enabledGuest }) => {
    const [formData, updateFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value.trim(),
        });
    };

    return (
        <div className="flex flex-col gap-2 mt-3">
            <h1 className="font-bold text-2xl">Register or continue as guest?</h1>
            <p className="mb-5">We'll send you a magick link.</p>
            <form
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    await ServiceAPI.registerAndSendMagickLink(formData);
                    alert('We sent you a magick link, check your email.');
                }}
            >
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        defaultValue={formData.firstname}
                        label="First name"
                        placeholder="Luke"
                        name="firstname"
                        required
                        onChange={handleChange}
                    />

                    <Input
                        defaultValue={formData.lastname}
                        placeholder="Skywalker"
                        label="Last name"
                        name="lastname"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-2">
                    <Input
                        defaultValue={formData.email}
                        placeholder="luke.skywalker@rebellion.inc"
                        label="Email"
                        name="email"
                        required
                        onChange={handleChange}
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="underline px-5 py-2 ml-2 rounded mt-5 w-40"
                        onClick={() => enabledGuest()}
                    >
                        Guest Checkout
                    </button>
                    <button type="submit" className="bg-[#000] text-[#fff] px-8 py-4 rounded mt-5 w-40">
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};
