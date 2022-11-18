import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { ParagraphCollection } from '../components/crystallize-components/paragraph-collection';
import { RelatedDocument } from '../components/related-document';
import { Product } from '../components/item/product';
import { Story } from '../../use-cases/contracts/Story';
import { buildSchemaMarkupForBlogPost } from '~/use-cases/SchemaMarkupBuilder';

export default ({ data: story }: { data: Story }) => {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(buildSchemaMarkupForBlogPost(story)),
                }}
            />
            <div className="2xl md:container md:px-6 px-4 mx-auto mt-20 mb-20">
                <div className="max-w-[1000px]">
                    <p className="mb-4 text-md">
                        {new Date(story.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    <h1 className="text-6xl font-semibold mb-2">{story.title}</h1>
                    <div className="md:w-3/4 w-full my-2 text-2xl leading-[1.8em]">
                        <ContentTransformer json={story.description.json} />
                    </div>
                </div>
            </div>

            <div className="container 2xl mt-5 w-screen mx-auto">
                <div className="max-w-[1200px] img-container overflow-hidden rounded-lg">
                    <Image {...story.medias?.images?.[0]} sizes="100vw" fallbackAlt={story.title} />
                </div>
            </div>

            <div className="2xl container mx-auto frntr-story ">
                <div className="max-w-[1000px] ">{story.story && <ParagraphCollection paragraphs={story.story} />}</div>
            </div>
            {story.relatedArticles && (
                <div className="2xl container px-6 mx-auto w-full mt-10">
                    <h3 className="font-bold mt-40 mb-4 text-xl">Read next</h3>
                    <div className="gap-5 lg:grid grid-cols-5 pb-5 flex flex-wrapl">
                        {story.relatedArticles?.map((item: any, index: number) => (
                            <div key={index}>
                                <RelatedDocument document={item} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {story.featuredProducts && (
                <div className="2xl container px-6 mx-auto w-full mt-10">
                    <h3 className="font-bold mt-20 mb-4 text-xl">Featured products</h3>
                    <div className="gap-5 lg:grid grid-cols-5 pb-5 flex flex-wrap">
                        {story.featuredProducts?.map((item: any, index: number) => {
                            return <Product item={item} key={index} />;
                        })}
                    </div>
                </div>
            )}
        </>
    );
};
