import { DimensionsTable } from './dimensions-table';
import { ParagraphCollection } from '../crystallize-components/paragraph-collection';
import { PropertiesTable } from '../crystallize-components/properties-table';
import { Files } from '../../components/product/files';
import { Paragraph } from '../../../use-cases/contracts/Paragraph';
import { CrystallizePropertiesTable } from '../../../use-cases/contracts/PropertiesTable';
import { FileDownload } from '../../../use-cases/contracts/FileDownload';
import { Dimensions } from '../../../use-cases/contracts/Dimensions';

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
