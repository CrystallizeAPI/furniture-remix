import { ChangeEvent, FormEvent, useState } from 'react'
import { HydratedCart } from '~/core/components/cart'
import { customer, registerAndSendMagickLink } from '~/core/UseCases'
import { useAuth } from '~/core/hooks/useAuth'
import { ClientOnly } from '@crystallize/reactjs-hooks'
import { HttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger'
import { HeadersFunction } from '@remix-run/node'
import { Payments } from '~/core/components/payments'
import { useLocalCart } from '~/core/hooks/useLocalCart'
import { useRemoteCart } from '~/core/hooks/useRemoteCart'
import { Image } from '@crystallize/reactjs-components/dist/image'

export const headers: HeadersFunction = () => {
    return HttpCacheHeaderTagger('1m', '1w', ['checkout']).headers
}

export default function Checkout() {
    const { isAuthenticated } = useAuth()
    const { cart } = useLocalCart()
    return (
        <div className="lg:w-content mx-auto w-full">
            <div className="flex gap-20 w-full">
                <CheckoutCart/>
                <div className= "rounded pt-5 px-10 w-3/5">
                    <ClientOnly fallback={<Form />}>{(() => {
                        if (!isAuthenticated) {
                            return <Form />
                        }
                        if (cart.cartId !== '') {
                            return <Payments />
                        }
                        return <></>;
                    })()}</ClientOnly>
                </div>
            
            </div>
        </div>
    )
}

export const Form: React.FC = () => {
    const [formData, updateFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value.trim(),
        })
    }

    return (
        <div className="flex flex-col gap-3 mt-3">
            <h1 className="font-bold text-2xl">Details</h1>
            <p className="mb-5">
                You need to register to place you order. We'll send you a magick
                link.
            </p>
            <form
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault()
                    await registerAndSendMagickLink(formData)
                    alert('We sent you a magick link, check your email.')
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

                <button
                    type="submit"
                    className="bg-[#000] text-[#fff] px-5 py-2 rounded mt-5 w-40"
                >
                    Register
                </button>
            </form>
        </div>
    )
}

export const CheckoutForm: React.FC = () => {
    const [formData, updateFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        streetAddress: '',
        city: '',
        zipCode: '',
        country: '',
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        updateFormData({
            ...formData,
            [event.target.name]: event.target.value.trim(),
        })
    }

    return (
        <div className="flex flex-col gap-3 w-3/5 mt-3">
            <h1 className="font-bold text-2xl mt-5 mb-5">Details</h1>
            <form
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault()
                    await customer(formData)
                }}
            >
                <div className="flex gap-3">
                    <input
                        defaultValue={formData.firstname}
                        type={'firstname'}
                        placeholder={'Frodo'}
                        name="firstname"
                        required
                        className="checkout-field w-2/4"
                        onChange={handleChange}
                    />
                    <input
                        defaultValue={formData.lastname}
                        type={'lastname'}
                        placeholder={'Baggins'}
                        name="lastname"
                        required
                        className="checkout-field w-2/4"
                        onChange={handleChange}
                    />
                </div>
                <input
                    defaultValue={formData.email}
                    type={'email'}
                    placeholder={'Frodo.ringmaster@shireclub.com'}
                    name="email"
                    required
                    className="checkout-field w-full"
                    onChange={handleChange}
                />
                <input
                    defaultValue={formData.streetAddress}
                    type={'text'}
                    placeholder={'Shire'}
                    name="streetAddress"
                    required
                    className="checkout-field w-full"
                    onChange={handleChange}
                />
                <div className="flex gap-3">
                    <input
                        defaultValue={formData.country}
                        type={'text'}
                        placeholder={'Middle Earth'}
                        name="country"
                        required
                        className="checkout-field w-2/4"
                        onChange={handleChange}
                    />
                    <input
                        defaultValue={formData.city}
                        type={'text'}
                        placeholder={'City'}
                        name="city"
                        required
                        className="checkout-field w-2/4"
                        onChange={handleChange}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        defaultValue={formData.zipCode}
                        type={'text'}
                        placeholder={'3130'}
                        name="zipCode"
                        required
                        className="checkout-field w-2/4"
                        onChange={handleChange}
                    />
                    <div className="flex gap-2 items-center">
                        <input type="checkbox" id="scales" name="scales" />
                        <label>Same as street address</label>
                    </div>
                </div>
                {/* <button
                    type="submit"
                    className="bg-[#000] text-[#fff] px-5 py-2 rounded mt-5 w-40"
                >
                    Pay using Stripe
                </button> */}
            </form>
            <Payments />
        </div>
    )
}

export const CheckoutCart: React.FC = () => {
    const { remoteCart, loading } = useRemoteCart()
    const { cart } = remoteCart || { cart: null, total: null }
    return (
        <div className="w-2/5">
            <h1 className="font-bold text-2xl mt-10 mb-5">Cart</h1>
            {cart &&
                cart.cart.items.map((item: any) => (
                    <div
                        key={item.id}
                        className="flex justify-between bg-grey2 p-5 items-center"
                    >
                        <div className="flex cart-item gap-3 items-center">
                            <Image
                                {...item?.variant.images?.[0]}
                                sizes="100px"
                            />
                            <div className="flex flex-col">
                                <p className="text-lg font-semibold w-full">
                                    {item.product.name}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            {cart && (
                <div className="flex flex-col gap-4 border-b-2 border-grey4 py-4 items-end">
                    <div className="flex text-grey3 justify-between w-60">
                        <p>Net</p>
                        <p>€ {cart.total.net}</p>
                    </div>
                    <div className="flex text-grey3 justify-between w-60">
                        <p>Tax amount</p>
                        <p>€ {cart.total.taxAmount}</p>
                    </div>
                    <div className="flex font-bold text-lg justify-between w-60">
                        <p>To pay</p>
                        <p>€ {cart.total.gross}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
