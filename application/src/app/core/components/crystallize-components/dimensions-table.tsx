import { useState } from 'react';
import Arrow from '~/assets/arrow.svg';
export const DimensionsTable = ({ dimensions }: { dimensions: any }) => {
    let [open, toggle] = useState(false);

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
            <div className={`rounded-md ${open ? 'h-auto -mt-4 mb-10' : 'h-0 overflow-hidden'}`}>
                <div>
                    {dimensions?.map((dimension: any) => (
                        <div key={dimension?.id} className="flex justify-between py-4 px-2 odd:bg-[#efefef]">
                            <p className="font-semibold text-md">{dimension?.name}</p>
                            <p className="text-md">
                                {dimension?.content?.number}
                                {dimension?.content?.unit}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
