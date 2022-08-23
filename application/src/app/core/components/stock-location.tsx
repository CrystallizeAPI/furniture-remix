import StockIcon from '~/assets/stockIcon.svg';
import { useState } from 'react';
const StockIndicators = ({ location }: { location: any }) => {
    const stock = location?.stock;
    if (stock < 1) {
        return (
            <>
                <div className="flex items-center gap-2">
                    <img className="w-[18px] h-[18px]" src={`${StockIcon}`} width="20" height="20" alt="User icon" />
                    <p className="font-semibold">{location.name}</p>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F42C04]" />
                </div>
                <p className="font-medium text-[#F42C04]">Out of stock</p>
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
                <p className="font-medium text-[#E0AC00]">Less then 20 in stock</p>
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
            <p className="font-medium text-green2 text-right">20+ in stock</p>
        </>
    );
};

export const StockLocations = ({ locations }: { locations: any }) => {
    if (!locations) return null;
    const [locationCountToShow, setLocationCountToShow] = useState(1);
    return (
        <div>
            {locations?.slice(0, locationCountToShow).map((location: any) => (
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
                        ? 'Show less availability options'
                        : `
                    Show more availability options (${locations.length - 1})`}
                </button>
            )}
        </div>
    );
};
