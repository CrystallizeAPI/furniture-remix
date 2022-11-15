import { json, LoaderFunction, HeadersFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/core-server/storefront.server';
import { useAppContext } from '~/core/app-context/provider';
import { ServiceAPI } from '~/use-cases/service-api';
import { Price } from '~/core/lib/pricing/pricing-component';
import { useAuth } from '~/core/hooks/useAuth';
import { MagickLoginForm } from '~/core/components/checkout-forms/magicklogin';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { isAuthenticated as isServerSideAuthenticated } from '~/core-server/authentication.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return json(
        { orderId: params.id, isServerSideAuthenticated: await isServerSideAuthenticated(request) },

        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['order' + params.id], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { orderId, isServerSideAuthenticated } = useLoaderData();
    const [tryCount, setTryCount] = useState(0);
    const [order, setOrder] = useState<any | null>(null);
    const { state: contextState } = useAppContext();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                setOrder(
                    await ServiceAPI({
                        language: contextState.language,
                        serviceApiUrl: contextState.serviceApiUrl,
                    }).fetchOrder(orderId),
                );
            } catch (exception) {
                timeout = setTimeout(() => {
                    setTryCount(tryCount + 1);
                }, 500 * tryCount);
            }
        })();
        return () => clearTimeout(timeout);
    }, [orderId, tryCount]);

    return (
        <div className="min-h-[70vh] items-center flex lg:w-content mx-auto w-full">
            <ClientOnly>
                {order && isAuthenticated && isServerSideAuthenticated ? (
                    <div className="w-3/4 mx-auto">
                        <div className="mt-10">
                            <h1 className="font-bold text-3xl">Order Confirmation</h1>
                            <p className="mt-4">We've received your order.</p>
                            <p> The order ID is: #{order.id}.</p>
                            <div className="mt-2">
                                {order.cart.map((item: any, index: number) => {
                                    return (
                                        <div key={index} className="bg-grey2 px-3 py-2 mb-2 gap-2 flex items-center">
                                            <div className="img-container overflow-hidden rounded-md img-contain w-[50px] h-[70px]">
                                                <img src={item.imageUrl} />
                                            </div>
                                            <div className="flex w-full justify-between">
                                                <div>
                                                    <p className="font-semibold">
                                                        {item.name} x {item.quantity}
                                                    </p>
                                                </div>
                                                <p>
                                                    <Price currencyCode={contextState.currency.code}>
                                                        {item.price.gross}
                                                    </Price>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div className="flex flex-col gap-4 border-t-2 border-grey4 py-4 items-end px-4 mt-5">
                                    <div className="flex text-grey3 justify-between w-60">
                                        <p>Net</p>
                                        <p>
                                            <Price currencyCode={contextState.currency.code}>{order.total.net}</Price>
                                        </p>
                                    </div>
                                    <div className="flex text-grey3 justify-between w-60">
                                        <p>Tax amount</p>
                                        <p>
                                            <Price currencyCode={contextState.currency.code}>
                                                {order.total.gross - order.total.net}
                                            </Price>
                                        </p>
                                    </div>
                                    <div className="flex font-bold text-xl justify-between w-60">
                                        <p>Paid</p>
                                        <p>
                                            <Price currencyCode={contextState.currency.code}>{order.total.gross}</Price>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="min-h-[70vh] items-center justify-center flex max-w-[500px] mx-auto">
                        <div className="mx-auto items-center justify-center flex w-full ">
                            <MagickLoginForm title="Login" onlyLogin actionTitle="Login" />
                        </div>
                    </div>
                )}
            </ClientOnly>
        </div>
    );
};
