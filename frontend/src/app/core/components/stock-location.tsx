export const StockLocations = ({ locations }: { locations: any }) => {
    return (
        <div>
            {locations.map((location: any) => (
                <div key={location.identifier}>
                    <p className="font-semibold mt-5">{location.name}</p>
                    {location.stock > 0 ? (
                        <div className="flex gap-3 items-baseline">
                            <div className="w-2.5 h-2.5 rounded-full bg-green" />
                            <p className="font-light">In stock: {location.stock}</p>
                        </div>
                    ) : (
                        <div className="flex gap-3 items-baseline">
                            <div className="w-2.5 h-2.5 rounded-full bg-red" />
                            <p className="font-light">Out of stock</p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
