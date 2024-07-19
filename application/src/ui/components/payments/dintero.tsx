import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../app-context/provider';
import logo from '~/assets/dinteroLogo.svg';
import { useLocalCart } from '../../hooks/useLocalCart';
import { ServiceAPI } from '../../../use-cases/service-api';
import useLocalStorage from '@rehooks/local-storage';
import { Customer } from '@crystallize/js-api-client';

export const DinteroButton: React.FC<{
    paying?: boolean;
    onClick: () => Promise<void> | void;
    children?: string;
}> = ({ paying = false, onClick, children }) => {
    const { _t } = useAppContext();
    const text = children ? children : '';
    return (
        <button
            className="w-full h-[70px] text-white mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
            disabled={paying}
            onClick={onClick}
        >
            <img className="px-1 h-[50px]" src={`${logo}`} height="50" alt="Dintero" />
            {paying ? (
                <span className="text-textBlack">{_t('payment.processing')}...</span>
            ) : (
                <span className="text-black">{`${text}`} ›</span>
            )}
        </button>
    );
};

export const Dintero: React.FC = () => {
    const { state } = useAppContext();
    const { cart, isEmpty } = useLocalCart();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    const [formLoading, setFormLoading] = useState(true);
    const iframeEmbedded = useRef(false);
    const [loadIframe, setLoadIframe] = useState(false);

    const variables = state.paymentImplementationVariables ? state.paymentImplementationVariables['dintero'] : {};

    if (!variables) {
        return null;
    }

    const triggerDintero = async () => {
        const data = await ServiceAPI({
            language: state.language,
            serviceApiUrl: state.serviceApiUrl,
        }).dintero.initiatePayment(cart);
        const container = document.getElementById('dintero-checkout-container') as HTMLDivElement | null;

        // Only embed the iframe if it's not already there
        if (
            typeof window !== 'undefined' &&
            container &&
            container.getElementsByTagName('iframe').length === 0 &&
            !iframeEmbedded.current &&
            !loadIframe
        ) {
            setLoadIframe(true);
            const { embed } = await import('@dintero/checkout-web-sdk');

            await embed({
                container,
                sid: data.sessionId,
                onSession: (event) => {
                    if (event.type === 'SessionLoaded') {
                        setFormLoading(false);
                    }
                },
                onPaymentError: (error: any) => {
                    console.error(error.name, error.message, error.stack);
                },
            });
            // Set the ref to true to indicate that the iframe has been embedded
            iframeEmbedded.current = true;
            setLoadIframe(false);
        }
    };

    useEffect(() => {
        const initializeDintero = async () => {
            if (!isEmpty()) {
                try {
                    //checking here coz library loads twice and we don't want to place the cart twice
                    const remoteCart = await ServiceAPI({
                        language: state.language,
                        serviceApiUrl: state.serviceApiUrl,
                    }).fetchCart(cart.cartId);
                    if (remoteCart.state !== 'placed') {
                        await ServiceAPI({
                            language: state.language,
                            serviceApiUrl: state.serviceApiUrl,
                        }).placeCart(cart, customer);
                    }
                } catch (exception) {
                    console.log(exception);
                }

                triggerDintero();
            }
        };
        initializeDintero();
    }, [isEmpty]);

    return (
        <>
            <div id="dintero-checkout-container">
                <div className="w-full text-center">
                    <p className=" text-lg font-semibold">Checkout using Dintero</p>
                </div>
                {formLoading && (
                    <div className="flex justify-center items-center h-96">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                    </div>
                )}
            </div>
            <img
                src="https://backoffice.dintero.com/checkouts/v1/branding/profiles/T11114188.5k9ELQ5JZQEnzokDwjXmNE/variant/colors/width/420/dintero_top_frame.svg"
                alt="Dintero payment options"
                className="w-full mx-auto my-5"
            />
        </>
    );
};
