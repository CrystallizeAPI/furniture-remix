import { useState } from 'react';
import Arrow from '~/assets/arrow.svg';
export const DimensionsTable = ({ dimensions }: { dimensions: any }) => {
    const [open, toggle] = useState(true);

    return (
        <div className="border-t border-[#dfdfdf] hover:bg-[#fefefe]">
            <button
                onClick={() => toggle(!open)}
                className="font-bold text-2xl py-10 flex items-center justify-between w-full"
            >
                <span>Dimensions</span>
                <img
                    src={`${Arrow}`}
                    alt="Arrow"
                    className={`w-[20px] h-[20px] mr-4 ${open ? '-scale-y-100' : 'scale-y-100	'}`}
                />
            </button>

            {open && dimensions && dimensions.length > 0 && (
                <div className="rounded-md h-auto -mt-4 mb-10">
                    <div>
                        {dimensions.map((dimension: any, index: number) => (
                            <div
                                key={`${index}-${dimension?.id}`}
                                className="flex justify-between py-4 px-2 odd:bg-[#efefef]"
                            >
                                <p className="font-semibold text-md">{dimension?.name}</p>
                                <p className="text-md">
                                    {dimension?.content?.number}
                                    {dimension?.content?.unit}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
