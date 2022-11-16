import { ProductSlim } from '~/use-cases/contracts/Product';
import { Shop } from '~/use-cases/contracts/Shop';
import {
    choiceComponentWithId,
    stringForRichTextComponentWithId,
    stringForSingleLineComponentWithId,
} from '~/use-cases/mapper/api-mappers';
import { createGrid } from '~/ui/lib/grid-tile/createGrid';
import { DataMapper } from '..';

export default (data: any): Shop => {
    const mapper = DataMapper();
    const [folder, hierarchy] = data;
    const hero = choiceComponentWithId(folder.components, 'hero-content');
    const grid = hero?.content?.grids?.[0] || (hero?.content?.items ? createGrid(hero?.content?.items) : null);

    const firstSeoChunk = folder.meta.content?.chunks[0];
    const dto: Shop = {
        name: folder.name,
        title: stringForSingleLineComponentWithId(folder.components, 'title') || data.name!,
        path: folder.path,
        description: stringForRichTextComponentWithId(folder.components, 'description') || data.name!,
        hero: grid
            ? {
                  id: `grid-${hero?.id ?? folder.id}`,
                  ...grid,
              }
            : undefined,
        seo: mapper.API.Object.APIMetaSEOComponentToSEO(firstSeoChunk),
        categories: hierarchy.tree.children.map((child: any) => {
            return {
                name: child.name,
                path: child.path,
                description: child.description?.content,
                products: child.children.map((product: any): ProductSlim => {
                    return {
                        id: product.id,
                        name: product.name,
                        path: product.path,
                        variant: mapper.API.Object.APIProductVariantToProductVariant(product.defaultVariant),
                        topics: [],
                    };
                }),
            };
        }),
    };
    return dto;
};
