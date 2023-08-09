import { Video } from '@crystallize/reactjs-components';
import { ContentTransformer } from '@crystallize/reactjs-components';
import { Paragraph } from '~/use-cases/contracts/Paragraph';
import { ImageGallery } from '../image-gallery';

export const ParagraphCollection: React.FC<{ paragraphs: Paragraph[] }> = ({ paragraphs }) => {
    if (paragraphs.length === 0) {
        return null;
    }

    return (
        <>
            {paragraphs.map((paragraph, index) => (
                <div key={index}>
                    <div className="mt-10 md:mt-10 lg:mx-10 mb-20 pt-5 max-w-[800px] frntr-paragraph mx-2 w-auto">
                        <div className="my-10 mx-auto">
                            <h2 className="font-bold mt-10 text-3xl">{paragraph.title}</h2>
                            <div className="frntr-content-transformer">
                                <ContentTransformer json={paragraph.body.json} />
                            </div>
                        </div>
                    </div>
                    <ImageGallery images={paragraph?.images} />
                    {paragraph.videos && paragraph.videos.length > 0 && (
                        <div className="w-full img-container img-contain md:py-0">
                            <Video
                                {...paragraph?.videos?.[0]}
                                thumbnailProps={{ sizes: '(max-width: 700px) 90vw, 700px' }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </>
    );
};
