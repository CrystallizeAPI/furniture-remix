import { useState } from 'react';
import Arrow from '~/assets/arrow.svg';

export const PropertiesTable = ({ table }: { table: any }) => {
    const [open, toggle] = useState(false);
    return (
        <div className="border-t border-[#dfdfdf] mt-20 hover:bg-[#fefefe]">
            <button
                onClick={() => toggle(!open)}
                className="font-bold text-2xl py-10 flex items-center justify-between w-full"
            >
                <span>{table?.title}</span>
                <img
                    src={`${Arrow}`}
                    alt="Arrow"
                    className={`w-[20px] h-[20px] mr-4 ${open ? '-scale-y-100' : 'scale-y-100	'}`}
                />
            </button>
            {open && table?.properties && table.properties.length > 0 && (
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
        </div>
    );
};
