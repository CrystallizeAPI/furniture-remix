import { DimensionsTable } from './crystallize-components/dimensions-table'
import { ParagraphCollection } from './crystallize-components/paragraph-collection'
import { PropertiesTable } from './crystallize-components/properties-table'
import { RelatedProduct } from './related-items/related-product'

export const ProductBody = ({ components }: { components: any }) => {
    let paragraphs = components.find(
        (component: any) => component.type === 'paragraphCollection'
    )?.content?.paragraphs
    let propertiesTable = components.find(
        (component: any) => component.type === 'propertiesTable'
    )?.content?.sections
    let dimensionsTable = components.find(
        (component: any) => component.id === 'dimensions'
    )?.content?.chunks
    let relatedProducts = components.find((component: any) => component.id === 'related-items')?.content?.items

    return (
        <div className="mt-20">
            <div className="w-3/4">
                {propertiesTable && (
                    <PropertiesTable table={propertiesTable?.[0]} />
                )}
                {dimensionsTable && (
                    <DimensionsTable dimensions={dimensionsTable?.[0]} />
                )}
                {paragraphs && <ParagraphCollection paragraphs={paragraphs} />}
            </div>
            <div>
            <div className='w-full'>
                <h3 className="font-bold mt-20 mb-10 text-xl">
                    You might also be interested in
                </h3>
                <div className="flex gap-5 overflow-x-scroll snap-mandatory snap-x scroll-p-0 pb-5">
                    {relatedProducts?.map((item: any, index: number) => (
                        <div key={index}>
                            <RelatedProduct product={item} />
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </div>
    )
}
