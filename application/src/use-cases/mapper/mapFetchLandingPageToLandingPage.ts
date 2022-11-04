import { LandingPage } from '~/core/contracts/LandingPage';
import mapAPIMetaSEOComponentToSEO from './mapAPIMetaSEOComponentToSEO';

export default (data: any): LandingPage => {
    const firstSeoChunk = data.meta.content.chunks?.[0];
    return {
        name: data.name,
        path: data.path,
        seo: mapAPIMetaSEOComponentToSEO(firstSeoChunk),
        grids: data.grids.content.grids.map((grid: any) => {
            return {
                id: grid.id,
                rows: grid.rows,
            };
        }),
    };
};
