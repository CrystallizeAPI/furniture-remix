import { Form, useSearchParams } from '@remix-run/react';
import { useEffect, useState } from 'react';

import Slider from 'rc-slider';

export const PriceRangeFilter = ({ price }: { price: { min: number; max: number } }) => {
    const [showSlider, setShowSlider] = useState(false);
    const [priceValue, setPriceValue] = useState(price);
    const [searchParams, setSearchParams] = useSearchParams();

    function onRangeChange(newValue: any) {
        setPriceValue({ min: newValue[0], max: newValue[1] });
    }
    function onRangeDone(newValue: any) {
        searchParams.set('min', newValue[0]);
        searchParams.set('max', newValue[1]);
        setSearchParams(searchParams);
    }
    return (
        <div className="relative bg-grey filter-container w-60 hover:cursor-pointer">
            <p onClick={() => setShowSlider(!showSlider)} className="text-textBlack px-4 py-2">
                Price range
            </p>
            {showSlider && (
                <div className="absolute w-full bg-grey  px-4 py-2">
                    <Slider
                        range
                        min={price.min}
                        max={price.max}
                        value={[priceValue.min, priceValue.max]}
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
                        <p className="text-sm">€{priceValue.min}</p>
                        <p className="text-sm">€{priceValue.max}</p>
                    </div>
                </div>
            )}
        </div>
    );
};
