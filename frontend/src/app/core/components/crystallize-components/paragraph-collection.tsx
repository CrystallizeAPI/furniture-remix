import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer';

export const ParagraphCollection = ({ paragraphs }: { paragraphs: any }) => {
    return (
        <div>
            {paragraphs?.map((paragraph: any, index: number) => (
                <div key={index}>
                    <div className='w-3/4  my-10'>
                    <h2 className="font-bold mt-10 text-2xl">{paragraph?.title?.text}</h2>
                    <div className="mb-5 mt-2 leading-[2.5em] text-xl">
                        <ContentTransformer json={paragraph.body.json} />
                    </div>
                    </div>
                    <img src={paragraph?.images?.[0]?.variants?.[8]?.url} className="my-5 w-full" />
                </div>
            ))}
        </div>
    );
};
