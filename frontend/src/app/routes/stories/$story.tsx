import { fetchDocument } from '~/core/UseCases'
import {
    HttpCacheHeaderTagger,
    HttpCacheHeaderTaggerFromLoader,
} from '~/core/Http-Cache-Tagger'
import { HeadersFunction, json, LoaderFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Image } from '@crystallize/reactjs-components/dist/image'
import { ContentTransformer } from '@crystallize/reactjs-components/dist/content-transformer'
import { RelatedDocument } from '~/core/components/related-items/related-document'
import { RelatedProduct } from '~/core/components/related-items/related-product'
import { ParagraphCollection } from '~/core/components/crystallize-components/paragraph-collection'

export const loader: LoaderFunction = async ({ params }) => {
    const path = `/stories/${params.story}`
    const document = await fetchDocument(path)
    return json({ document }, HttpCacheHeaderTagger('30s', '1w', [path]))
}
export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers
}

export default function ProductPage() {
    const { document } = useLoaderData()
    let title = document.components.find(
        (component: any) => component.type === 'singleLine'
    )?.content?.text
    let description = document.components.find(
        (component: any) => component.type === 'richText'
    )?.content?.json
    let media = document.components.find(
        (component: any) => component.type === 'componentChoice'
    )?.content?.selectedComponent?.content
    let paragraphs = document.components.find(
        (component: any) => component.type === 'paragraphCollection'
    )?.content?.paragraphs
    let relatedArticles = document.components.find(
        (component: any) => component.id === 'up-next'
    )?.content?.items
    let featuredProducts = document.components.find(
        (component: any) => component.id === 'featured'
    )?.content?.items

    return (
        <div className="lg:w-content mx-auto w-full mt-10">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <div className="w-3/4 mt-5">
                <ContentTransformer json={description} />
            </div>
            <div className="document-media-container mt-5">
                <img src={media?.images?.[0]?.variants?.[8]?.url} />
            </div>
            <div className="w-3/4 mx-auto">
               <ParagraphCollection paragraphs={paragraphs}/>
            </div>
            <div>
                <h3 className="font-bold mt-40 mb-4 text-xl">Read next</h3>
                <div className="flex gap-5 overflow-x-scroll">
                    {relatedArticles?.map((item: any, index: number) => (
                        <div key={index}>
                            <RelatedDocument document={item} />
                        </div>
                    ))}
                </div>
            </div>
            <div className='w-full'>
                <h3 className="font-bold mt-20 mb-4 text-xl">
                    Featured products
                </h3>
                <div className="flex gap-5 overflow-x-scroll snap-mandatory snap-x scroll-p-0 pb-5">
                    {featuredProducts?.map((item: any, index: number) => (
                        <div key={index}>
                            <RelatedProduct product={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
