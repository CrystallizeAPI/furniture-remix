import { DimensionsTable } from './crystallize-components/dimensions-table';
import { ParagraphCollection } from './crystallize-components/paragraph-collection';
import { PropertiesTable } from './crystallize-components/properties-table';
import { Files } from '~/core/components/crystallize-components/files';
import { Paragraph } from '../contracts/Paragraph';
import { CrystallizePropertiesTable } from '../contracts/PropertiesTable';
import { FileDownload } from '../contracts/Files';
import { Dimensions } from '../contracts/Dimensions';

export const ProductBody: React.FC<{
    story?: Paragraph[];
    dimensions?: Dimensions;
    propertiesTable?: CrystallizePropertiesTable[];
    downloads?: FileDownload[];
}> = ({ story, dimensions, propertiesTable, downloads }) => {
    return (
        <>
            {story && <ParagraphCollection paragraphs={story} />}
            <div className="mt-20">
                {propertiesTable &&
                    propertiesTable.map((table: CrystallizePropertiesTable, index: number) => (
                        <PropertiesTable table={table} key={index} />
                    ))}
                {dimensions && <DimensionsTable dimensions={dimensions} />}
                {downloads && downloads.length > 0 && <Files files={downloads!} />}
            </div>
        </>
    );
};
