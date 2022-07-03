import { useAuth } from '~/core/hooks/useAuth';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { Payments } from '~/core/components/payments';
import { useLocalCart } from '~/core/hooks/useLocalCart';
import { CheckoutCart } from '~/core/components/checkout-forms/cart';
import { MagickLoginForm } from '~/core/components/checkout-forms/magicklogin';
import { GuestCheckoutForm } from '~/core/components/checkout-forms/guest';
import { useState } from 'react';
import { getStoreFront } from '~/core-server/storefront.server';
import { getHost } from '~/core-server/http-utils.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const { shared } = await getStoreFront(getHost(request));
    return json({}, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['checkout'], shared.config));
};

export default () => {
    const { isAuthenticated } = useAuth();
    const { cart } = useLocalCart();
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    return (
        <div className="2xl lg:container lg:px-6 px-2 mx-auto min-h-[100vh]">
            <div className="flex gap-20 lg:flex-row flex-col">
                <CheckoutCart />
                <div className="rounded pt-5 lg:px-10 lg:w-3/5 w-full px-3">
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
