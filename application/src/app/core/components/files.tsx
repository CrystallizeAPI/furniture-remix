import FileDownloadIcon from '~/assets/documentDownloadIcon.svg';
import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer';
import { useState } from 'react';
import Arrow from '~/assets/arrow.svg';

export const Files = ({ chunks }: { chunks: any }) => {
    let [open, toggle] = useState(false);

    return (
        <div className="border-t border-[#dfdfdf] hover:bg-[#fefefe]">
            <button
                onClick={() => toggle(!open)}
                className="font-bold text-2xl py-10 flex items-center justify-between w-full"
            >
                <span>Manuals and specifications</span>
                <img
                    src={`${Arrow}`}
                    alt="Arrow"
                    className={`w-[20px] h-[20px] mr-4 ${open ? '-scale-y-100' : 'scale-y-100	'}`}
                />
            </button>

            <div
                className={`grid gap-5 grid-col-1 sm:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 ${
                    open ? 'h-auto -mt-4 mb-10' : 'h-0 overflow-hidden'
                }`}
            >
                {chunks?.map((chunk: any, i: any) => {
                    const title = chunk.find((cmp: any) => cmp.id === 'title')?.content?.text;
                    const description = chunk.find((cmp: any) => cmp.id === 'description')?.content?.json;
                    const files = chunk.find((cmp: any) => cmp.id === 'files')?.content?.files;
                    return (
                        <div className="bg-[#efefef] p-6 min-h-[300px] flex h-full flex-col justify-between w-full rounded-md">
                            <div className="mt-2 gap-2 mb-4">
                                <img
                                    className="w-[25px] h-[25px] mb-2"
                                    src={`${FileDownloadIcon}`}
                                    width="40"
                                    height="40"
                                    alt="User icon"
                                />
                                <p className="font-semibold text-md">{title}</p>
                                <div className="text-sm text-elipsis">
                                    <ContentTransformer json={description} />
                                </div>
                            </div>

                            <div className="flex text-sm flex-col">
                                {files?.map((file: any) => (
                                    <a className="mt-1 underline truncate" href={file.url}>
                                        ➞ {file?.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
