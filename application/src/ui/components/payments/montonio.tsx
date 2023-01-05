import { useAppContext } from '~/ui/app-context/provider';
import logo from '~/assets/montonioLogo.svg';
import { useLocalCart } from '~/ui/hooks/useLocalCart';
import { useEffect, useState } from 'react';
import useLocalStorage from '@rehooks/local-storage';
import { Customer } from '@crystallize/js-api-client';
import { ServiceAPI } from '~/use-cases/service-api';
import { PickupPoint } from '~/use-cases/payments/montonio/types';

export const MontonioButton: React.FC<{
    paying?: boolean;
    disabled?: boolean;
    onClick: () => Promise<void> | void;
}> = ({ paying = false, disabled = false, onClick }) => {
    const { _t } = useAppContext();
    return (
        <button
            className="w-full h-[70px] text-white mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black"
            disabled={paying || disabled}
            onClick={onClick}
        >
            <img className="px-1 h-[25px]" src={`${logo}`} height="35" alt="Montonio" />
            <span className="text-textBlack">{paying ? _t('payment.processing') : ''}</span>
            <span className="text-black text-2xl"> ›</span>
        </button>
    );
};

export const Montonio: React.FC = () => {
    const { cart, isEmpty } = useLocalCart();
    const [paying, setPaying] = useState(false);
    const { state, _t } = useAppContext();
    const [customer] = useLocalStorage<Partial<Customer>>('customer', {});
    const [pickupPoints, setPickupPoints] = useState<Record<string, PickupPoint[]>>();
    const [pickupPoint, setPickupPoint] = useState<PickupPoint | undefined>();
    const API = ServiceAPI({ language: state.language, serviceApiUrl: state.serviceApiUrl });

    if (isEmpty()) {
        return null;
    }

    useEffect(() => {
        (async () => {
            const pickupPoints = await API.montonio.fetchPickupPoints();
            const points = Object.keys(pickupPoints).reduce((memo: any, country) => {
                // we only propose EE for the boilerplate
                if (country !== 'EE') {
                    return memo;
                }
                const types: Record<string, any> = pickupPoints[country].providers.omniva;
                return {
                    ...memo,
                    [country]: Object.keys(types).reduce((memo: any, type) => {
                        // only parcel_machine for the boilerplates
                        if (type !== 'parcel_machine') {
                            return memo;
                        }
                        return [...memo, ...types[type]];
                    }, []),
                };
            }, {});
            setPickupPoints(points);
        })();
    }, []);

    return (
        <>
            {pickupPoints && (
                <div className="flex justify-between">
                    <p>{_t('payment.montonio.shippingFeature')}</p>
                    <p>{_t('payment.montonio.shippingConstraint')}</p>
                    <select
                        defaultValue={''}
                        onChange={(event) => {
                            const [country, uuid] = event.target.value.split(':');
                            setPickupPoint(pickupPoints[country].find((point: PickupPoint) => point.uuid === uuid));
                        }}
                    >
                        <option disabled value={''}>
                            {_t('selectPickupPoint')}
                        </option>
                        {Object.keys(pickupPoints).map((country) => {
                            return (
                                <optgroup key={country} label={country}>
                                    {pickupPoints[country].map((point: PickupPoint) => {
                                        return (
                                            <option key={point.uuid} value={`${point.country}:${point.uuid}`}>
                                                {point.name}
                                            </option>
                                        );
                                    })}
                                </optgroup>
                            );
                        })}
                    </select>
                </div>
            )}

            {pickupPoint && (
                <div>
                    <hr />
                    <ul>
                        <li>
                            {pickupPoint.address} {pickupPoint.country}
                        </li>
                        <li>
                            {pickupPoint.locality} {pickupPoint.region}
                        </li>
                    </ul>
                </div>
            )}

            <MontonioButton
                paying={paying}
                disabled={!pickupPoint}
                onClick={async () => {
                    setPaying(true);
                    try {
                        await API.placeCart(cart, customer, {
                            pickupPoint,
                        });
                        const link = await ServiceAPI({
                            language: state.language,
                            serviceApiUrl: state.serviceApiUrl,
                        }).montonio.fetchPaymentLink(cart);
                        window.location.href = link.url;
                    } catch (exception) {
                        console.log(exception);
                    }
                }}
            />
        </>
    );
};
