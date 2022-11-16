import { LandingPage } from '../../contracts/LandingPage';
import { DataMapper } from '..';

export default (data: any): LandingPage => {
    const mapper = DataMapper();
    const firstSeoChunk = data.meta.content?.chunks?.[0];
    return {
        name: data.name,
        path: data.path,
        seo: mapper.API.Object.APIMetaSEOComponentToSEO(firstSeoChunk),
        grids: data.grids.content.grids.map((grid: any) => {
            return {
                id: grid.id,
                rows: grid.rows,
            };
        }),
    };
};
