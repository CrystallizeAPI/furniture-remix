import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { Grid } from '~/core/components/grid-cells/grid';
import { RequestContext } from '~/use-cases/http/utils';
import { LandingPage } from '../../use-cases/contracts/LandingPage';

export const fetchData = async (path: string, request: RequestContext, params: any): Promise<LandingPage> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    return await api.fetchLandingPage(path);
};

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
