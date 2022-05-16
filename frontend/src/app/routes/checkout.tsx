import { ChangeEvent, FormEvent, useState } from 'react';
import { HydratedCart } from '~/core/components/cart';
import { registerAndSendMagickLink } from '~/core/UseCases';
import { useAuth } from '~/core/hooks/useAuth';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { HeadersFunction } from '@remix-run/node';
import { Payments } from '~/core/components/payments';
import { useLocalCart } from '~/core/hooks/useLocalCart';

export const headers: HeadersFunction = () => {
    return HttpCacheHeaderTagger('1m', '1w', ['checkout']).headers;
};

export default function Checkout() {
    const { isAuthenticated } = useAuth();
    const { cart } = useLocalCart();
    return (
        <div className="lg:w-content mx-auto w-full">
            <h1 className="font-bold text-4xl mt-10 mb-5">Checkout</h1>
            <div className="flex gap-10">
                <div className="w-2/4 bg-grey mt-10 rounded p-10">
                    <ClientOnly fallback={<Form />}>
                        {(() => {
                            if (!isAuthenticated) {
                                return <Form />;
                            }
                            if (cart.cartId !== '') {
                                return <Payments />;
                            }
                            return <></>;
                        })()}
                    </ClientOnly>
                </div>
            </div>
            <div className="w-2/4">
                <HydratedCart />
            </div>
        </div>
    );
}

export const Form: React.FC = () => {
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
        <>
            <p className="mb-5">You need to register to place you order. We'll send you a magick link.</p>
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
            </form>
        </>
    );
};
