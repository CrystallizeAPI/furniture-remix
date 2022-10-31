import { ContentTransformer, Image } from '@crystallize/reactjs-components';
import { buildSchemaMarkupForBlogPost } from '../SchemaMarkupBuilder';
import { ParagraphCollection } from '../components/crystallize-components/paragraph-collection';
import { RelatedDocument } from '../components/related-items/related-document';
import { Product } from '../components/item/product';
import { fetchData as abstractStoryFetchData } from './AbstractStory';
import { RequestContext } from '~/core-server/http-utils.server';

export type Story = any;

export const fetchData = async (path: string, request: RequestContext, params: any): Promise<Story> => {
    return abstractStoryFetchData(path, request, params);
};

export default ({ data: story }: { data: Story }) => {
    const getComponentContent = (id: string) => {
        let component = story.components.find((component: any) => component.id === id);
        return component?.content || null;
    };
    let title = getComponentContent('title')?.text;
    let intro = getComponentContent('intro')?.json;
    let media = getComponentContent('media')?.selectedComponent?.content;
    let paragraphs = getComponentContent('story')?.paragraphs;
    let relatedArticles = getComponentContent('up-next')?.items;
    let featuredProducts = getComponentContent('featured')?.items;
    const date = new Date(story.createdAt);
    let creationDate = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
                    <p className="mb-4 text-md">{creationDate}</p>
                    <h1 className="text-6xl font-semibold mb-2">{title}</h1>
                    <div className="md:w-3/4 w-full my-2 text-2xl leading-[1.8em]">
                        <ContentTransformer json={intro} />
                    </div>
                </div>
            </div>
            <div className="container 2xl mt-5 w-screen mx-auto">
                <div className="max-w-[1200px] img-container overflow-hidden rounded-lg">
                    <Image {...media?.images?.[0]} sizes="100vw" alt={title} />
                </div>
            </div>
            <div className="2xl container mx-auto frntr-story ">
                <div className="max-w-[1000px] ">
                    <ParagraphCollection paragraphs={paragraphs} />
                </div>
            </div>
            {relatedArticles && (
                <div className="2xl container px-6 mx-auto w-full mt-10">
                    <h3 className="font-bold mt-40 mb-4 text-xl">Read next</h3>
                    <div className="gap-5 lg:grid grid-cols-5 pb-5 flex flex-wrapl">
                        {relatedArticles?.map((item: any, index: number) => (
                            <div key={index}>
                                <RelatedDocument document={item} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {featuredProducts && (
                <div className="2xl container px-6 mx-auto w-full mt-10">
                    <h3 className="font-bold mt-20 mb-4 text-xl">Featured products</h3>
                    <div className="gap-5 lg:grid grid-cols-5 pb-5 flex flex-wrap">
                        {featuredProducts?.map((item: any, index: number) => {
                            return <Product item={item} key={index} />;
                        })}
                    </div>
                </div>
            )}
        </>
    );
};
