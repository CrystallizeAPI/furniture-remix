import Arrow from '~/assets/arrow.svg';
import { useAppContext } from '../../app-context/provider';
import { Dimensions } from '~/use-cases/contracts/Dimensions';

export const DimensionsTable: React.FC<{ dimensions: Dimensions }> = ({ dimensions }) => {
    const { _t } = useAppContext();
    if (Object.keys(dimensions).length === 0) {
        return null;
    }
    return (
        <details className="border-t border-[#dfdfdf] hover:bg-[#fefefe] frntr-accordination" open>
            <summary className="font-bold text-2xl py-10 flex items-center justify-between w-full">
                <span>{_t('dimensions')}</span>
                <img src={`${Arrow}`} alt="Arrow" className="frntr-accordination-arrow w-[20px] h-[20px] mr-4" />
            </summary>

            <div className="rounded-md h-auto -mt-4 mb-10">
                <div>
                    {Object.keys(dimensions).map((key, index) => {
                        const dimension = dimensions[key];
                        return (
                            <div key={`${index}-${key}`} className="flex justify-between py-4 px-2 odd:bg-[#efefef]">
                                <p className="font-semibold text-md">{dimension.title}</p>
                                <p className="text-md">
                                    {dimension.value}
                                    {dimension.unit}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </details>
    );
};
