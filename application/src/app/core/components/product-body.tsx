import { DimensionsTable } from './crystallize-components/dimensions-table';
import { ParagraphCollection } from './crystallize-components/paragraph-collection';
import { PropertiesTable } from './crystallize-components/properties-table';

export const ProductBody = ({ components }: { components: any }) => {
    let paragraphs = components.find((component: any) => component.type === 'paragraphCollection')?.content?.paragraphs;
    let propertiesTable = components.find((component: any) => component.type === 'propertiesTable')?.content?.sections;
    let dimensionsTable = components.find((component: any) => component.id === 'dimensions')?.content?.chunks;

    return (
        <>
            {paragraphs && <ParagraphCollection paragraphs={paragraphs} />}
            {propertiesTable && <PropertiesTable table={propertiesTable?.[0]} />}
            {dimensionsTable && <DimensionsTable dimensions={dimensionsTable?.[0]} />}
        </>
    );
};
