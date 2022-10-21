import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { Grid } from '~/core/components/grid-cells/grid';
import { RequestContext } from '~/core-server/http-utils.server';

export type LandingPage = any;

export const fetchData = async (path: string, request: RequestContext, params: any): Promise<LandingPage> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    return await api.fetchCampaignPage(path);
};

export default ({ data }: { data: any }) => {
    let grid = data?.component?.content?.grids;

    return (
        <div className="min-h-[100vh]">
            {grid?.map((grid: any, index: number) => (
                <div key={`${grid.id}-${index}`} className="mx-auto w-full test">
                    <Grid grid={grid} />
                </div>
            ))}
        </div>
    );
};
