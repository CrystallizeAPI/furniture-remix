import { useAuth } from '~/core/hooks/useAuth';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { Payments } from '~/core/components/payments';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { CheckoutCart } from '~/core/components/checkout-forms/cart';
import { MagickLoginForm } from '~/core/components/checkout-forms/magicklogin';
import { GuestCheckoutForm } from '~/core/components/checkout-forms/guest';
import { useState } from 'react';
import { getStoreFront } from '~/core/storefront/storefront.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared } = await getStoreFront(request.headers.get('Host')!);
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['checkout'], shared.config));
};

export default () => {
    const { isAuthenticated } = useAuth();
    const { cart } = useLocalCart();
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    return (
        <div className="2xl container px-6 mx-auto min-h-[100vh] w-full">
            <div className="flex gap-20 w-full">
                <CheckoutCart />
                <div className="rounded pt-5 px-10 w-3/5">
                    <ClientOnly
                        fallback={
                            <MagickLoginForm
                                enabledGuest={() => setIsGuestCheckout(true)}
                                actionTitle="Register"
                                title="Register or continue as guest?"
                            />
                        }
                    >
                        {(() => {
                            if (!isAuthenticated) {
                                return isGuestCheckout ? (
                                    <GuestCheckoutForm />
                                ) : (
                                    <MagickLoginForm
                                        enabledGuest={() => setIsGuestCheckout(true)}
                                        actionTitle="Register"
                                        title="Register or continue as guest?"
                                    />
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
};
