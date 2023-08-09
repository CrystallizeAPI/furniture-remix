import FileDownloadIcon from '~/assets/documentDownloadIcon.svg';
import { ContentTransformer } from '@crystallize/reactjs-components';
import Arrow from '~/assets/arrow.svg';
import { useAppContext } from '../../app-context/provider';
import { FileDownload } from '~/use-cases/contracts/FileDownload';

export const Files: React.FC<{ files: FileDownload[] }> = ({ files }) => {
    const { _t } = useAppContext();
    return (
        <details className="border-t border-[#dfdfdf] hover:bg-[#fefefe] frntr-accordination min-h-fit" open>
            <summary className="font-bold text-2xl py-10 flex items-center justify-between w-full">
                <span>{_t('specifications')}</span>
                <img src={`${Arrow}`} alt="Arrow" className="frntr-accordination-arrow w-[20px] h-[20px] mr-4" />
            </summary>

            {files.length > 0 && (
                <div className="grid gap-5 grid-col-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 h-auto -mt-4 mb-10">
                    {files.map((file, index) => {
                        return (
                            <div
                                key={index}
                                className="bg-[#efefef] p-6 min-h-[300px] flex h-full flex-col justify-between w-full rounded-md"
                            >
                                <div className="mt-2 gap-2 mb-4">
                                    <img
                                        className="w-[25px] h-[25px] mb-2"
                                        src={`${FileDownloadIcon}`}
                                        width="40"
                                        height="40"
                                        alt="User icon"
                                    />
                                    <p className="font-semibold text-md">{file.title}</p>
                                    <div className="text-sm text-elipsis">
                                        <ContentTransformer json={file.description?.json} />
                                    </div>
                                </div>

                                {files.length > 0 && (
                                    <div className="flex text-sm flex-col">
                                        {file.files.map((file) => (
                                            <a className="mt-1 underline truncate" href={file.url} key={file.url}>
                                                ➞ {file.title}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </details>
    );
};
