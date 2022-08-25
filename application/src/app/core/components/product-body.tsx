import { DimensionsTable } from './crystallize-components/dimensions-table';
import { ParagraphCollection } from './crystallize-components/paragraph-collection';
import { PropertiesTable } from './crystallize-components/properties-table';
import { Files } from '~/core/components/files';

export const ProductBody = ({ components }: { components: any }) => {
    let paragraphs = components.find((component: any) => component.type === 'paragraphCollection')?.content?.paragraphs;
    let propertiesTable = components.find((component: any) => component.type === 'propertiesTable')?.content?.sections;
    let dimensionsTable = components.find((component: any) => component.id === 'dimensions')?.content?.chunks;
    let downloadChunks = components?.find((component: any) => component.id === 'downloads')?.content?.chunks;

    return (
        <>
            {paragraphs && <ParagraphCollection paragraphs={paragraphs} />}
            <div className="mt-20">
                {propertiesTable &&
                    propertiesTable.map((table: any, index: number) => <PropertiesTable table={table} key={index} />)}
                {dimensionsTable && <DimensionsTable dimensions={dimensionsTable?.[0]} />}
                {downloadChunks && <Files chunks={downloadChunks} />}
            </div>
        </>
    );
};
