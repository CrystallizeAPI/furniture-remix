import { useAuth } from '~/ui/hooks/useAuth';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { Payments } from '~/ui/components/payments';
import { useLocalCart } from '~/ui/hooks/useLocalCart';
import { CheckoutCart } from '~/ui/components/checkout-forms/cart';
import { MagickLoginForm } from '~/ui/components/checkout-forms/magicklogin';
import { AddressForm } from '~/ui/components/checkout-forms/address';
import { useState } from 'react';
import { getStoreFront } from '~/core/storefront.server';
import { getContext } from '~/use-cases/http/utils';
import { isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import { useLoaderData } from '@remix-run/react';
import { privateJson } from '~/core/bridge/privateJson.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return privateJson(
        { isServerSideAuthenticated: await isServerSideAuthenticated(request) },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['checkout'], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { isServerSideAuthenticated } = useLoaderData();
    const { isAuthenticated } = useAuth();
    const { cart } = useLocalCart();
    const [isGuestCheckout, setIsGuestCheckout] = useState(false);
    const [showPayments, setShowPayments] = useState(false);

    return (
        <div className="2xl lg:container lg:px-6 px-2 mx-auto min-h-[100vh]">
            <div className="flex gap-20 lg:flex-row flex-col">
                <CheckoutCart />
                <div className="rounded pt-5 lg:px-10 lg:w-3/5 w-full px-3">
                    <ClientOnly>
                        {(() => {
                            if (!isServerSideAuthenticated || !isAuthenticated) {
                                return isGuestCheckout ? (
                                    <>
                                        <AddressForm
                                            title="Guest Checkout"
                                            onValidSubmit={() => setShowPayments(true)}
                                        />
                                        {showPayments && <Payments />}
                                    </>
                                ) : (
                                    <MagickLoginForm
                                        enabledGuest={() => setIsGuestCheckout(true)}
                                        actionTitle="Register"
                                        title="Register or continue as guest?"
                                    />
                                );
                            }
                            return (
                                <>
                                    <AddressForm title="Address" onValidSubmit={() => setShowPayments(true)} />
                                    {showPayments && <Payments />}
                                </>
                            );
                        })()}
                    </ClientOnly>
                </div>
            </div>
        </div>
    );
};
