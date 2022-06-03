import { useAuth } from '~/core/hooks/useAuth';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { Payments } from '~/core/components/payments';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { CheckoutCart } from '~/core/components/checkout-forms/cart';
import { RegisterCheckoutForm } from '~/core/components/checkout-forms/register';
import { GuestCheckoutForm } from '~/core/components/checkout-forms/guest';
import { useState } from 'react';
import { getStoreFront } from '~/core/storefront.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared } = await getStoreFront(request.headers.get('Host')!);
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('30s', '30s', ['checkout'], shared.config));
};

export default function Checkout() {
    const { isAuthenticated } = useAuth();
    const { cart } = useLocalCart();
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    return (
        <div className="2xl container px-6 mx-auto w-full">
            <div className="flex gap-20 w-full">
                <CheckoutCart />
                <div className="rounded pt-5 px-10 w-3/5">
                    <ClientOnly fallback={<RegisterCheckoutForm enabledGuest={() => setIsGuestCheckout(true)} />}>
                        {(() => {
                            if (!isAuthenticated) {
                                return isGuestCheckout ? (
                                    <GuestCheckoutForm />
                                ) : (
                                    <RegisterCheckoutForm enabledGuest={() => setIsGuestCheckout(true)} />
                                );
                            }
                            if (cart.cartId !== '') {
                                return <Payments isGuest={false} />;
                            }
                            return <></>;
                        })()}
                    </ClientOnly>
                </div>
            </div>
        </div>
    );
}
