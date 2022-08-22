import _ from 'lodash';
import { useState } from 'react';
import filterIcon from '~/assets/filterIcon.svg';
import { useSearchParams } from '@remix-run/react';

export const AttributeFilter: React.FC<{ attributes: any; formRef: any | null }> = ({ attributes, formRef }) => {
    const [show, setShow] = useState(false);
    const [searchParams] = useSearchParams();
    const selectedAttributes = searchParams.getAll('attr');

    return (
        <>
            {!_.isEmpty(attributes) && (
                <div>
                    <div
                        className="relative flex justify-between items-center w-60 bg-grey py-2 px-6 rounded-md hover:cursor-pointer"
                        onClick={() => setShow(!show)}
                    >
                        <p className="text-md font-bold">Filter by attributes</p>
                        <img src={filterIcon} alt="" />
                    </div>
                    {show ? (
                        <div className="absolute w-60 z-50">
                            {Object.keys(attributes).map((key) => (
                                <div key={key} className="bg-grey px-5 py-2 border-bottom-2">
                                    <p className="font-semibold">{key}</p>
                                    {attributes[key].map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                value={`${key}_${item.value}`}
                                                key={index}
                                                name="attr"
                                                defaultChecked={selectedAttributes.includes(`${key}_${item.value}`)}
                                            />
                                            <label htmlFor={item.value}>{item.value}</label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            )}
        </>
    );
};
