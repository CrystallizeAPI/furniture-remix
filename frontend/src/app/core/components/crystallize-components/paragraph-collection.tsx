import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer';
import { Image } from '@crystallize/reactjs-components/dist/image';
export const ParagraphCollection = ({ paragraphs }: { paragraphs: any }) => {
    return (
        <>
            {paragraphs?.map((paragraph: any, index: number) => (
                <>
                    <div key={index} className="px-20 pt-10">
                        <div className="my-10 mx-auto">
                            <h2 className="font-bold mt-10 text-2xl">{paragraph?.title?.text}</h2>
                            <div className="mb-5 mt-2 leading-[2.5em] text-xl">
                                <ContentTransformer json={paragraph.body.json} />
                            </div>
                        </div>
                    </div>

                    {paragraph?.images?.map((img: Any) => (
                        <div className="img-container rounded-md overflow-hidden">
                            <Image {...img} />
                        </div>
                    ))}
                </>
            ))}
        </>
    );
};
