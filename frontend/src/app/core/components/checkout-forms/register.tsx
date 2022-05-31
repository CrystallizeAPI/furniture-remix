import { ChangeEvent, FormEvent, useState } from 'react';
import { registerAndSendMagickLink } from '~/core/UseCases';

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
        <div className="flex flex-col gap-3 mt-3">
            <h1 className="font-bold text-2xl">Wanna Register?</h1>
            <p className="mb-5">We'll send you a magick link.</p>
            <form
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    await registerAndSendMagickLink(formData);
                    alert('We sent you a magick link, check your email.');
                }}
            >
                <input
                    defaultValue={formData.firstname}
                    type={'firstname'}
                    placeholder={'Firstname'}
                    name="firstname"
                    required
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
                <br />
                <input
                    defaultValue={formData.lastname}
                    type={'lastname'}
                    placeholder={'Lastname'}
                    name="lastname"
                    required
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
                <br />
                <input
                    defaultValue={formData.email}
                    type={'email'}
                    placeholder={'Email'}
                    name="email"
                    required
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
          focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
          invalid:border-pink-500 invalid:text-pink-600
          focus:invalid:border-pink-500 focus:invalid:ring-pink-500"
                />
                <br />

                <button type="submit" className="bg-[#000] text-[#fff] px-5 py-2 rounded mt-5 w-40">
                    Register
                </button>
                <button
                    type="button"
                    className="bg-[#aaa] text-[#fff] px-5 py-2 ml-2 rounded mt-5 w-40"
                    onClick={() => enabledGuest()}
                >
                    Guest Checkout
                </button>
            </form>
        </div>
    );
};
