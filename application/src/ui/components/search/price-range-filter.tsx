'use client';
import { useRef, useState } from 'react';
import Slider from 'rc-slider';
import { useAppContext } from '../../app-context/provider';
import { Price } from '../../lib/pricing/pricing-component';

export const PriceRangeFilter: React.FC<{ min: number; max: number; formRef: any | null }> = ({
    min,
    max,
    formRef,
}) => {
    const { state: contextState, _t } = useAppContext();
    const [showSlider, setShowSlider] = useState(false);
    const [priceValue, setPriceValue] = useState({ min, max });
    function onRangeChange(newValue: any) {
        setPriceValue({ min: newValue[0], max: newValue[1] });
    }
    const minInput = useRef<HTMLInputElement>(null);
    const maxInput = useRef<HTMLInputElement>(null);

    function onRangeDone(newValue: any) {
        minInput.current!.value = newValue[0];
        maxInput.current!.value = newValue[1];
        formRef.current.submit();
    }

    return (
        <div className="relative bg-grey filter-container rounded-md text-md w-60 font-bold hover:cursor-pointer">
            <input type={'hidden'} name="min" defaultValue={min} ref={minInput} />
            <input type={'hidden'} name="max" defaultValue={max} ref={maxInput} />

            <p onClick={() => setShowSlider(!showSlider)} className="text-textBlack px-4 py-2">
                {_t('search.price.range')}
            </p>
            {showSlider && (
                <div className="absolute w-full bg-grey  px-4 py-2">
                    <Slider
                        range
                        min={min}
                        max={max}
                        defaultValue={[priceValue.min, priceValue.max]}
                        allowCross={false}
                        onChange={onRangeChange}
                        onAfterChange={onRangeDone}
                        marks={{}}
                        handleStyle={{
                            backgroundColor: '#000',
                            border: '1px solid #000',
                        }}
                        trackStyle={{
                            backgroundColor: '#000',
                        }}
                    />
                    <div className="flex justify-between mt-2">
                        <p className="text-sm">
                            <Price currencyCode={contextState.currency.code}>{priceValue.min}</Price>
                        </p>
                        <p className="text-sm">
                            <Price currencyCode={contextState.currency.code}>{priceValue.max}</Price>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};
