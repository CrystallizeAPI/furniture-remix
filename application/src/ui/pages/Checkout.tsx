'use client';

import { ClientOnly } from '@crystallize/reactjs-hooks';
import { useState } from 'react';
import { AddressForm } from '../components/checkout-forms/address';
import { CheckoutCart } from '../components/checkout-forms/cart';
import { MagickLoginForm } from '../components/checkout-forms/magicklogin';
import { Payments } from '../components/payments';
import { useAuth } from '../hooks/useAuth';

export default ({ isServerSideAuthenticated }: { isServerSideAuthenticated: boolean }) => {
    const { isAuthenticated } = useAuth();
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
