import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer';
import { ImageGallery } from '../image-gallery';
export const ParagraphCollection = ({ paragraphs }: { paragraphs: any }) => {
    return (
        <>
            {paragraphs?.map((paragraph: any, index: number) => (
                <div key={index}>
                    <div className="mt-40 lg:mx-10 mb-20 pt-10 max-w-[800px] frntr-paragraph mx-2">
                        <div className="my-10 mx-auto">
                            <h2 className="font-bold mt-10 text-4xl">{paragraph?.title?.text}</h2>
                            <div className="frntr-content-transformer">
                                <ContentTransformer json={paragraph.body.json} />
                            </div>
                        </div>
                    </div>
                    <ImageGallery images={paragraph?.images} />
                </div>
            ))}
        </>
    );
};
