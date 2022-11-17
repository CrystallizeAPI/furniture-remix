import StockIcon from '~/assets/stockIcon.svg';
import { useState } from 'react';
import { useAppContext } from '../../app-context/provider';
import { StockLocation } from '../../../use-cases/contracts/StockLocation';

const StockIndicators: React.FC<{ location: StockLocation }> = ({ location }) => {
    const { _t } = useAppContext();
    const stock = location.stock || 0;
    if (stock < 1) {
        return (
            <>
                <div className="flex items-center gap-2">
                    <img className="w-[18px] h-[18px]" src={`${StockIcon}`} width="20" height="20" alt="User icon" />
                    <p className="font-semibold">{location.name}</p>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F42C04]" />
                </div>
                <p className="font-medium text-black">{_t('stock.outOfStock')}</p>
            </>
        );
    }
    if (stock > 0 && stock < 21) {
        return (
            <>
                <div className="flex items-center gap-2">
                    <img className="w-[18px] h-[18px]" src={`${StockIcon}`} width="20" height="20" alt="User icon" />
                    <p className="font-semibold">{location.name}</p>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFC60A]" />
                </div>
                <p className="font-medium text-black">{_t('stock.lowStock')}</p>
            </>
        );
    }
    return (
        <>
            <div className="flex items-center gap-2">
                <img className="w-[18px] h-[18px]" src={`${StockIcon}`} width="20" height="20" alt="User icon" />
                <p className="font-semibold">{location.name}</p>
                <div className="w-2.5 h-2.5 rounded-full bg-green2" />
            </div>
            <p className="font-medium text-green2 text-right">{_t('stock.inStock')}</p>
        </>
    );
};

export const StockLocations: React.FC<{ locations: StockLocation[] }> = ({ locations }) => {
    const [locationCountToShow, setLocationCountToShow] = useState(1);
    const { _t } = useAppContext();
    if (locations.length === 0) return null;
    return (
        <div>
            {locations.slice(0, locationCountToShow).map((location) => (
                <div key={location.identifier} className="flex pt-2 items-center gap-2 justify-between">
                    <StockIndicators location={location} />
                </div>
            ))}
            {locations.length > 1 && (
                <button
                    onClick={() =>
                        locationCountToShow == locations.length
                            ? setLocationCountToShow(1)
                            : setLocationCountToShow(locations.length)
                    }
                    className="text-[#000] font-regular text-xs ml-7 mt-1 opacity-[0.6] hover:opacity-[1] underline"
                >
                    {locationCountToShow == locations.length
                        ? _t('stock.showLessAvailability')
                        : _t('stock.showMoreAvailability', { count: locations.length - 1 })}
                </button>
            )}
        </div>
    );
};
