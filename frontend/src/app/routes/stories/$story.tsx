import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer';
import { RelatedDocument } from '~/core/components/related-items/related-document';
import { Product } from '~/core/components/item/product';
import { ParagraphCollection } from '~/core/components/crystallize-components/paragraph-collection';
import { Image } from '@crystallize/reactjs-components/dist/image';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { buildMetas } from '~/core/MicrodataBuilder';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

type LoaderData = {
    document: Awaited<ReturnType<typeof CrystallizeAPI.fetchDocument>>;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/stories/${params.story}`;
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);

    const document = await CrystallizeAPI.fetchDocument(secret.apiClient, path, version);
    return json<LoaderData>({ document }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default () => {
    const { document } = useLoaderData() as LoaderData;

    let getComponentContent = (id: string) => {
        let component = document.components.find((component: any) => component.id === id);
        return component.content;
    };

    let title = getComponentContent('title')?.text;
    let description = getComponentContent('description')?.json;
    let media = getComponentContent('media')?.selectedComponent?.content;
    let paragraphs = getComponentContent('body')?.paragraphs;
    let relatedArticles = getComponentContent('up-next')?.items;
    let featuredProducts = getComponentContent('featured')?.items;
    const date = new Date(document.createdAt);
    let creationDate = date.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="">
            <div className="2xl container mx-auto mt-40 mb-40">
                <div className="px-6  max-w-[1000px]">
                    <p className="mb-4 text-md">{creationDate}</p>
                    <h1 className="text-6xl font-semibold mb-2">{title}</h1>
                    <div className="w-3/4 my-10 text-2xl leading-[1.8em]">
                        <ContentTransformer json={description} />
                    </div>
                </div>
            </div>
            <div className="container 2xl img-container overflow-hidden rounded-lg mt-5 w-screen mx-auto">
                <Image {...media?.images?.[0]} sizes="100vw" />
            </div>
            <div className="2xl container mx-auto frntr-story">
                <ParagraphCollection paragraphs={paragraphs} />
            </div>
            {relatedArticles && (
                <div className="2xl container px-6 mx-auto w-full mt-10">
                    <h3 className="font-bold mt-40 mb-4 text-xl">Read next</h3>
                    <div className="grid grid-cols-3 gap-5 overflow-x-scroll">
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
                    <div className="flex gap-5 pb-5">
                        {featuredProducts?.map((item: any, index: number) => {
                            return <Product item={item} key={index} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
