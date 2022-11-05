import { Cateogry } from '~/core/contracts/Category';
import { stringForRichTextComponentWithId, stringForSingleLineComponentWithId } from '~/lib/api-mappers';
import { createGrid } from '~/lib/grid-tile/createGrid';
import mapAPIMetaSEOComponentToSEO from './mapAPIMetaSEOComponentToSEO';

export default (data: any): Cateogry => {
    const hero = data.components.find((component: any) => component.id === 'hero-content')?.content?.selectedComponent;
    const grid = hero?.content?.grids?.[0] || (hero?.content?.items ? createGrid(hero?.content?.items) : null);
    const firstSeoChunk = data.meta.content.chunks[0];
    const dto: Cateogry = {
        name: data.name,
        path: data.path,
        title: stringForSingleLineComponentWithId(data.components, 'title') || data.name!,
        description: stringForRichTextComponentWithId(data.components, 'description') || data.name!,
        hero: grid
            ? {
                  id: `grid-${hero?.id ?? data.id}`,
                  ...grid,
              }
            : undefined,
        seo: mapAPIMetaSEOComponentToSEO(firstSeoChunk),
    };

    return dto;
};
