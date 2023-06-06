import { useState } from 'react';
import filterIcon from '~/assets/filterIcon.svg';
import useSearchParams from '~/bridge/ui/useSearchParams';
import { useAppContext } from '../../app-context/provider';

export const AttributeFilter: React.FC<{ attributes: any; handleChange?: Function }> = ({
    attributes,
    handleChange,
}) => {
    const [show, setShow] = useState(false);
    const { _t } = useAppContext();
    const [searchParams] = useSearchParams();
    const selectedAttributes = searchParams?.getAll('attr');

    return (
        <>
            {Object.keys(attributes).length > 0 && (
                <div>
                    <div
                        className="relative flex justify-between items-center w-60 bg-grey py-2 px-6 rounded-md hover:cursor-pointer"
                        onClick={() => setShow(!show)}
                    >
                        <p className="text-md font-bold">{_t('search.filterByAttributes')}</p>
                        <img src={filterIcon} alt="" />
                    </div>
                    {show && (
                        <div className="absolute w-60 z-50">
                            {Object.keys(attributes).map((key) => (
                                <div key={key} className="bg-grey px-5 py-2 border-bottom-2">
                                    <p className="font-semibold">{key}</p>
                                    {attributes[key].map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                value={`${key}_${item.value}`}
                                                name="attr"
                                                defaultChecked={selectedAttributes?.includes(`${key}_${item.value}`)}
                                                onChange={(e) => handleChange && handleChange(e)}
                                            />
                                            <label htmlFor={item.value}>{item.value}</label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
};
