'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '../app-context/provider';
import { ServiceAPI } from '~/use-cases/service-api';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import { OrderDisplay } from '../components/display-order';
import { MagickLoginForm } from '../components/checkout-forms/magicklogin';

export default ({ id, cartId }: { id: string; cartId?: string }) => {
    const [tryCount, setTryCount] = useState(0);
    const [order, setOrder] = useState<any | null>(null);
    const { state: contextState, _t } = useAppContext();

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        (async () => {
            try {
                setOrder(
                    await ServiceAPI({
                        language: contextState.language,
                        serviceApiUrl: contextState.serviceApiUrl,
                    }).fetchOrder(id, cartId),
                );
            } catch (exception) {
                timeout = setTimeout(() => {
                    setTryCount(tryCount + 1);
                }, 500 * tryCount);
            }
        })();
        return () => clearTimeout(timeout);
    }, [id, tryCount]);

    return (
        <div className="min-h-[70vh] items-center flex lg:w-content mx-auto w-full">
            <ClientOnly>
                <>
                    {order && <OrderDisplay order={order} />}
                    {tryCount > 5 && (
                        <div className="mx-auto items-center justify-center flex w-full ">
                            <MagickLoginForm title="Login" onlyLogin actionTitle="Login" />
                        </div>
                    )}
                    {!order && tryCount <= 5 && (
                        <div className="min-h-[70vh] items-center justify-center flex flow-row max-w-[500px] mx-auto">
                            <div className="loader mr-3" />
                            {_t('order.loadingMessage')}
                        </div>
                    )}
                </>
            </ClientOnly>
        </div>
    );
};
