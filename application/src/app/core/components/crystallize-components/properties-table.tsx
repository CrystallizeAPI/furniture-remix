import Arrow from '~/assets/arrow.svg';

export const PropertiesTable = ({ table }: { table: any }) => (
    <details className="border-t border-[#dfdfdf] mt-20 hover:bg-[#fefefe] frntr-accordination">
        <summary className="font-bold text-2xl py-10 flex items-center justify-between w-full">
            <span>{table?.title}</span>
            <img src={`${Arrow}`} alt="Arrow" className="frntr-accordination-arrow w-[20px] h-[20px] mr-4" />
        </summary>
        {table?.properties && table.properties.length > 0 && (
            <div className="rounded-md h-auto -mt-4 mb-10">
                <div>
                    {table.properties.map((property: any) => (
                        <div className="flex justify-between py-4 px-2 odd:bg-[#efefef]" key={property?.key}>
                            <p className="font-semibold text-md">{property?.key}</p>
                            <p className="text-md">{property?.value}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </details>
);
