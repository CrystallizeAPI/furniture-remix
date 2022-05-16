export const PropertiesTable = ({ table }: { table: any }) => {
    return (
        <div className="w-2/4">
            <h2 className="text-2xl font-bold">{table?.title}</h2>
            <div>
                {table?.properties?.map((property: any) => (
                    <div
                        className="flex mt-5 border-b pb-5 border-grey4 justify-between"
                        key={property?.key}
                    >
                        <p className="font-bold">{property?.key}</p>
                        <p>{property?.value}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
