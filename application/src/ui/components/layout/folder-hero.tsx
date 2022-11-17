import { Grid } from '../grid/grid';

export const FolderHero = ({ component }: { component: any }) => {
    let grid = component?.content?.grids?.[0];
    return <div className="w-full mt-10">{grid && <Grid grid={grid} />}</div>;
};
