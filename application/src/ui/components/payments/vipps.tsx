import { useLocalCart } from '../../hooks/useLocalCart';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';
import { ServiceAPI } from '~/use-cases/service-api';
import { useAppContext } from '../../app-context/provider';
import logo from '~/assets/vippsLogo.svg';
import { Customer } from '~/use-cases/contracts/Customer';

export const VippsButton: React.FC<{
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
            <img className="px-1 h-[50px]" src={`${logo}`} height="50" alt="Vipps" />
            {paying ? (
                <span className="text-textBlack">{_t('payment.processing')}...</span>
            ) : (
                <span className="text-black">{`${text}`} ›</span>
            )}
        </button>
    );
};

export const Vipps: React.FC = () => {
    const { cart, isEmpty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const { state } = useAppContext();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    const [qrURL, setQRURL] = useState<string | null>(null);
    const [methodFlow, setMethodFlow] = useState<string | null>(null);

    useEffect(() => {
        if (methodFlow !== 'CHECKOUT') {
            const vippsJS = document.createElement('script');
            vippsJS.src = 'https://checkout.vipps.no/vippsCheckoutSDK.js';
            vippsJS.onload = async () => {};
            document.head.appendChild(vippsJS);
        }
    }, [methodFlow]);

    if (isEmpty()) {
        return null;
    }

    const excecute = async (method: string, flow: string, callback: (result: any) => void) => {
        if (!isEmpty()) {
            try {
                await ServiceAPI({
                    language: state.language,
                    serviceApiUrl: state.serviceApiUrl,
                }).placeCart(cart, customer);
                const response = await ServiceAPI({
                    language: state.language,
                    serviceApiUrl: state.serviceApiUrl,
                }).vipps.fetchPaymentIntent(cart, method, flow);
                callback(response);
            } catch (exception) {
                console.log(exception);
            }
        }
    };
    if (qrURL) {
        return <img src={qrURL} />;
    }

    return (
        <ul>
            {(!methodFlow || methodFlow === 'CARD_WEB_REDIRECT') && (
                <li>
                    <VippsButton
                        paying={paying}
                        onClick={async () => {
                            setMethodFlow('CARD_WEB_REDIRECT');
                            setPaying(true);
                            await excecute('CARD', 'WEB_REDIRECT', (result) => {
                                window.location.href = result.redirectUrl;
                            });
                        }}
                    >
                        Card on the Web
                    </VippsButton>
                </li>
            )}
            {(!methodFlow || methodFlow === 'WALLET_WEB_REDIRECT') && (
                <li>
                    <VippsButton
                        paying={paying}
                        onClick={async () => {
                            setMethodFlow('WALLET_WEB_REDIRECT');
                            setPaying(true);
                            await excecute('WALLET', 'WEB_REDIRECT', (result) => {
                                window.location.href = result.redirectUrl;
                            });
                        }}
                    >
                        Wallet on the Web
                    </VippsButton>
                </li>
            )}
            {(!methodFlow || methodFlow === 'WALLET_NATIVE_REDIRECT') && (
                <li>
                    <VippsButton
                        paying={paying}
                        onClick={async () => {
                            setMethodFlow('WALLET_NATIVE_REDIRECT');
                            setPaying(true);
                            await excecute('WALLET', 'NATIVE_REDIRECT', (result) => {
                                window.location.href = result.redirectUrl;
                            });
                        }}
                    >
                        Wallet on Mobile
                    </VippsButton>
                </li>
            )}
            {(!methodFlow || methodFlow === 'WALLET_QR') && (
                <li>
                    <VippsButton
                        paying={paying}
                        onClick={async () => {
                            setMethodFlow('WALLET_QR');
                            setPaying(true);
                            await excecute('WALLET', 'QR', (result) => {
                                setQRURL(result.redirectUrl);
                            });
                        }}
                    >
                        Wallet with QR code
                    </VippsButton>
                </li>
            )}
            {(!methodFlow || methodFlow === 'CHECKOUT_IFRAME') && (
                <li>
                    <VippsButton
                        paying={paying}
                        onClick={async () => {
                            setMethodFlow('CHECKOUT_IFRAME');
                            setPaying(true);
                            await excecute('CHECKOUT', 'IFRAME', async (result) => {
                                //@ts-ignore
                                window.VippsCheckout({
                                    checkoutFrontendUrl: result.checkoutFrontendUrl,
                                    iFrameContainerId: 'vipps-checkout-frame-container',
                                    language: 'no',
                                    token: result.token,
                                });
                            });
                        }}
                    >
                        IFrame Checkout
                    </VippsButton>
                </li>
            )}
            {(!methodFlow || methodFlow === 'CHECKOUT_HANDOFF') && (
                <li>
                    <VippsButton
                        paying={paying}
                        onClick={async () => {
                            setMethodFlow('CHECKOUT_HANDOFF');
                            setPaying(true);
                            await excecute('CHECKOUT', 'HANDOFF', async (result) => {
                                //@ts-ignore
                                window.VippsCheckoutDirect({
                                    checkoutFrontendUrl: result.checkoutFrontendUrl,
                                    language: 'no',
                                    token: result.token,
                                });
                            });
                        }}
                    >
                        Handoff Checkout
                    </VippsButton>
                </li>
            )}
            <div id="vipps-checkout-frame-container" />
        </ul>
    );
};
