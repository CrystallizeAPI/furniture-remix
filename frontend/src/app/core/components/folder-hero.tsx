import { GridRenderer, GridRenderingType } from '@crystallize/reactjs-components';
import { GridItem } from './grid-item';

export const FolderHero = ({ component }: { component: any }) => {
    let grid = component?.content?.grids?.[0];
    return (
        <div className="w-full test h-full mt-10">
            {grid && (
                <GridRenderer
                    grid={grid}
                    type={GridRenderingType.Div}
                    cellComponent={({ cell }: { cell: any }) => <GridItem cell={cell} />}
                />
            )}
        </div>
    );
};
