const StockIndicators = ({ location }: { location: any }) => {
    const stock = location?.stock;
    if (stock < 1) {
        return (
            <>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#F42C04]" />
                    <p className="font-medium">{location.name}</p>
                </div>
                <p className="font-medium text-[#F42C04]">Out of stock</p>
            </>
        );
    }
    if (stock > 0 && stock < 21) {
        return (
            <>
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFC60A]" />
                    <p className="font-medium">{location.name}</p>
                </div>
                <p className="font-medium text-[#E0AC00]">Less then 20 in stock</p>
            </>
        );
    }
    return (
        <>
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-green2" />
                <p className="font-regular">{location.name}</p>
            </div>
            <p className="font-medium text-green2">20+ in stock</p>
        </>
    );
};

export const StockLocations = ({ locations }: { locations: any }) => {
    if (!locations) return;
    return (
        <div>
            {locations?.map((location: any) => (
                <div key={location.identifier} className="flex py-2 items-center items-center gap-2 justify-between">
                    <StockIndicators location={location} />
                </div>
            ))}
        </div>
    );
};
