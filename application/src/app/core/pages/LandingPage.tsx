import { getHost, getLocale, isPreview } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { Grid } from '~/core/components/grid-cells/grid';

export type LandingPage = any;

export const fetchData = async (path: string, request: any, params: any): Promise<LandingPage> => {
    const { shared, secret } = await getStoreFront(getHost(request));
    const api = CrystallizeAPI(secret.apiClient, getLocale(request), isPreview(request));
    return await api.fetchCampaignPage(path);
};

export const PDF = ({ data }: { data: any }) => {
    return null;
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
