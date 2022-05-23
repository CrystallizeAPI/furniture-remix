import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer';

export const ParagraphCollection = ({ paragraphs }: { paragraphs: any }) => {
    return (
        <div>
            {paragraphs?.map((paragraph: any, index: number) => (
                <div key={index}>
                    <h2 className="font-bold mt-10 text-lg mb-5">{paragraph?.title?.text}</h2>
                    <div className="my-5">
                        <ContentTransformer json={paragraph.body.json} />
                    </div>
                    <img src={paragraph?.images?.[0]?.variants?.[8]?.url} className="my-5 w-full" />
                </div>
            ))}
        </div>
    );
};
