import { Grid } from '../components/grid/grid';
import { LandingPage } from '~/use-cases/contracts/LandingPage';

export default ({ data: landing }: { data: LandingPage }) => {
    return (
        <div className="min-h-[100vh]">
            {landing.grids.map((grid, index) => (
                <div key={`${grid.id}-${index}`} className="mx-auto w-full test">
                    <Grid grid={grid} />
                </div>
            ))}
        </div>
    );
};
