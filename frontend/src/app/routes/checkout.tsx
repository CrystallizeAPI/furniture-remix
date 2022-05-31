import { useAuth } from '~/core/hooks/useAuth';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { HttpCacheHeaderTaggerFromLoader, SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { Payments } from '~/core/components/payments';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { CheckoutCart } from '~/core/components/checkout-forms/cart';
import { RegisterCheckoutForm } from '~/core/components/checkout-forms/register';
import { GuestCheckoutForm } from '~/core/components/checkout-forms/guest';
import { useState } from 'react';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const superFast = await getSuperFast(request.headers.get('Host')!);
    return json({}, SuperFastHttpCacheHeaderTagger('30s', '30s', ['checkout'], superFast.config));
};

export default function Checkout() {
    const { isAuthenticated } = useAuth();
    const { cart } = useLocalCart();
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    return (
        <div className="lg:w-content mx-auto w-full">
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
