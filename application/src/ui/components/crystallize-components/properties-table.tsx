import Arrow from '~/assets/arrow.svg';
import { CrystallizePropertiesTable } from '~/use-cases/contracts/PropertiesTable';

export const PropertiesTable: React.FC<{ table: CrystallizePropertiesTable }> = ({ table }) => {
    return (
        <details className="border-t border-[#dfdfdf] mt-20 hover:bg-[#fefefe] frntr-accordination" open>
            <summary className="font-bold text-2xl py-10 flex items-center justify-between w-full">
                <span>{table?.title}</span>
                <img src={`${Arrow}`} alt="Arrow" className="frntr-accordination-arrow w-[20px] h-[20px] mr-4" />
            </summary>
            {table.properties && (
                <div className="rounded-md h-auto -mt-4 mb-10">
                    <div>
                        {Object.keys(table.properties).map((key) => (
                            <div className="flex justify-between py-4 px-2 odd:bg-[#efefef]" key={key}>
                                <p className="font-semibold text-md">{key}</p>
                                <p className="text-md">{table.properties[key]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </details>
    );
};
