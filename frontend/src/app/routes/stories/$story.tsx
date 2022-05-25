import { fetchDocument } from '~/core/UseCases';
import { SuperFastHttpCacheHeaderTagger, HttpCacheHeaderTaggerFromLoader } from '~/core/Http-Cache-Tagger';
import { HeadersFunction, json, LoaderFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer';
import { RelatedDocument } from '~/core/components/related-items/related-document';
import { RelatedProduct } from '~/core/components/related-items/related-product';
import { ParagraphCollection } from '~/core/components/crystallize-components/paragraph-collection';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { Image } from '@crystallize/reactjs-components/dist/image';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/stories/${params.story}`;
    const superFast = await getSuperFast(request.headers.get('Host')!);
    const document = await fetchDocument(superFast.apiClient, path, version);
    return json({ document }, SuperFastHttpCacheHeaderTagger('30s', '30s', [path], superFast.config));
};

export default function ProductPage() {
    const { document } = useLoaderData();
    let title = document.components.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = document.components.find((component: any) => component.type === 'richText')?.content?.json;
    let media = document.components.find((component: any) => component.type === 'componentChoice')?.content
        ?.selectedComponent?.content;
    let paragraphs = document.components.find((component: any) => component.type === 'paragraphCollection')?.content
        ?.paragraphs;
    let relatedArticles = document.components.find((component: any) => component.id === 'up-next')?.content?.items;
    let featuredProducts = document.components.find((component: any) => component.id === 'featured')?.content?.items;
    const date = new Date(document.createdAt);
    let creationDate = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
console.log(media)
    return (
        <div className="">
            <div className="lg:w-content mx-auto w-full mt-10">
                <h1 className="text-4xl font-semibold mb-5">{title}</h1>
                <p className="mb-10">{creationDate}</p>
                <div className="w-3/4 my-10 text-2xl leading-[2.3em]">
                <ContentTransformer json={description} />
            </div>
            </div>
            <div className="document-media-container mt-5 lg:w-[w-full] w-screen mx-auto">
                <Image {...media?.images?.[0]} sizes="100vw"/>
            </div>
            <div className="w-3/4 mx-auto">
                <ParagraphCollection paragraphs={paragraphs} />
            </div>
            <div className='lg:w-content mx-auto w-full mt-10'>
                <h3 className="font-bold mt-40 mb-4 text-xl">Read next</h3>
                <div className="flex gap-5 overflow-x-scroll">
                    {relatedArticles &&
                        relatedArticles?.map((item: any, index: number) => (
                            <div key={index}>
                                <RelatedDocument document={item} />
                            </div>
                        ))}
                </div>
            </div>
            <div className="lg:w-content mx-auto w-full mt-10">
                <h3 className="font-bold mt-20 mb-4 text-xl">Featured products</h3>
                <div className="flex gap-5 overflow-x-scroll snap-mandatory snap-x scroll-p-0 pb-5">
                    {featuredProducts &&
                        featuredProducts?.map((item: any, index: number) => (
                            <div key={index}>
                                <RelatedProduct product={item} />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}
