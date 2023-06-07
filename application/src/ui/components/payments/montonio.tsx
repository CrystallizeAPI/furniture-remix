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
            className="w-full h-[70px] text-white mt-2 rounded-md px-8 bg-grey py-4 flex flex-row justify-between items-center border border-transparent hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
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
    const [pickupSuggestions, setPickupSuggestions] = useState<Record<string, PickupPoint[]>>();
    const [pickupInput, setPickupInput] = useState('');

    const [banks, setBanks] = useState<any | undefined>();
    const [bank, setBank] = useState<string | undefined>();

    const [openLocationSelector, setOpenLocationSelector] = useState(false);

    const API = ServiceAPI({
        language: state.language,
        serviceApiUrl: state.serviceApiUrl,
    });

    if (isEmpty()) {
        return null;
    }
    useEffect(() => {
        API.montonio.fetchPickupPoints().then((pickupPoints) => {
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
            setPickupSuggestions(points);
        });
        API.montonio.fetchBanks().then((banks) => {
            const availableBanks = Object.keys(banks).reduce((memo: any, country) => {
                // we only propose EE for the boilerplate
                if (country !== 'EE') {
                    return memo;
                }
                return {
                    ...memo,
                    [country]: banks[country],
                };
            }, {});
            setBanks(availableBanks);
        });
    }, []);

    const onInputChange = (event: any) => {
        let suggestions: any = { EE: [] };
        const value = event.target.value;
        setPickupInput(value);
        if (value.length > 0) {
            const regex = new RegExp(`^${value}`, `i`);
            suggestions['EE'] = pickupSuggestions?.['EE']?.filter((v: any) => v.name.match(regex));
            setPickupSuggestions(suggestions);
        } else {
            setPickupSuggestions(pickupPoints);
        }
    };

    //group pickup points by locality
    const groupByKey = (locations: any[] | undefined, key: string) =>
        locations?.reduce(
            (acc: any, obj: { [x: string]: string }) => ({
                ...acc,
                [obj[key]]: (acc[obj[key]] || []).concat(obj),
            }),
            {},
        );

    let suggestionsGroupedByLocality = groupByKey(pickupSuggestions?.['EE'], 'locality');

    return (
        <>
            {pickupPoints && (
                <div className="flex flex-col gap-2 mb-4">
                    <p className="text-sm font-semibold mb-3">{_t('payment.montonio.shippingConstraint')}</p>
                    <div>
                        <div
                            className="bg-white w-full flex justify-between items-center py-2 px-4 cursor-pointer"
                            onClick={() => setOpenLocationSelector(!openLocationSelector)}
                        >
                            <p>{_t('payment.montonio.selectPickupPoint')}</p>
                            <span>↓</span>
                        </div>
                        {openLocationSelector && (
                            <div className="flex flex-col gap-2 bg-white px-3">
                                <input
                                    onChange={onInputChange}
                                    placeholder="Search..."
                                    value={pickupInput}
                                    type="text"
                                    className="border border-black px-4 py-2 mt-2"
                                />
                                <div>
                                    {pickupSuggestions!?.['EE']?.length > 0 &&
                                        Object?.entries(suggestionsGroupedByLocality).map(
                                            (suggestion: any, index: number) => (
                                                <div key={index}>
                                                    <p className="font-bold mt-4">{suggestion?.[0]}</p>
                                                    <div>
                                                        {suggestion?.[1]?.map((s: any) => (
                                                            <div
                                                                key={s.uuid}
                                                                onClick={() => {
                                                                    setPickupInput(s.name);
                                                                    setPickupSuggestions({});
                                                                    setPickupPoint(s);
                                                                }}
                                                                className="cursor-pointer py-2 hover:bg-grey"
                                                            >
                                                                {s.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {banks && (
                <div className="flex flex-col gap-2 mb-4">
                    <p className="text-sm font-semibold mb-3">{_t('payment.montonio.paywithbanklinks')}</p>
                    <ul className="grid grid-cols-3 gap-2">
                        {banks['EE'].payment_methods.map((method: any) => {
                            return (
                                <li
                                    className={`${
                                        bank === method.code ? 'selected border-2' : ''
                                    } cursor-pointer flex items-center justify-center`}
                                    key={method.code}
                                    onClick={() => {
                                        setBank(method.code);
                                    }}
                                >
                                    <img
                                        src={method.logo_url}
                                        width={100}
                                        alt={method.name}
                                        className="object-contain w-[100px] h-[75px]"
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {pickupPoint && (
                <div className="bg-[#fff] p-3 px-4 flex-col gap-2">
                    <p>
                        {pickupPoint.address} {pickupPoint.country}
                    </p>
                    <p>
                        {pickupPoint.locality}, {pickupPoint.region}
                    </p>
                </div>
            )}

            <MontonioButton
                paying={paying}
                disabled={!pickupPoint || !bank}
                onClick={async () => {
                    setPaying(true);
                    try {
                        await API.placeCart(cart, customer, {
                            pickupPoint,
                        });
                        const link = await ServiceAPI({
                            language: state.language,
                            serviceApiUrl: state.serviceApiUrl,
                        }).montonio.fetchPaymentLink(cart, bank!);
                        window.location.href = link.url;
                    } catch (exception) {
                        console.log(exception);
                    }
                }}
            />
            <p className="text-xs mt-4 text-grey6">Note: {_t('payment.montonio.shippingFeature')}</p>
        </>
    );
};
