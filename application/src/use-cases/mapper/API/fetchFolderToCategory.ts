import { Category } from '~/use-cases/contracts/Category';
import {
    choiceComponentWithId,
    stringForRichTextComponentWithId,
    stringForSingleLineComponentWithId,
} from '~/use-cases/mapper/api-mappers';
import { createGrid } from '~/ui/lib/grid-tile/createGrid';
import { DataMapper } from '..';

export default (data: any): Category => {
    const mapper = DataMapper();
    const hero = choiceComponentWithId(data.components, 'hero-content');
    const grid = hero?.content?.grids?.[0] || (hero?.content?.items ? createGrid(hero?.content?.items) : null);
    const firstSeoChunk = data.meta.content.chunks[0];
    const dto: Category = {
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
        seo: mapper.API.Object.APIMetaSEOComponentToSEO(firstSeoChunk),
    };

    return dto;
};
