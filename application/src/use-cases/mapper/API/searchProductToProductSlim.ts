import { ProductSlim } from '../../contracts/Product';
import { DataMapper } from '..';

export default (data: any): ProductSlim[] => {
    const mapper = DataMapper();
    return (
        data.map(({ node }: any) => {
            return {
                id: node.id,
                name: node.name,
                path: node.path,
                variant: mapper.API.Object.APIProductVariantToProductVariant(node.matchingVariant),
                topics:
                    node.topics?.map((topic: any) => {
                        return {
                            name: topic.name,
                            path: topic.path,
                        };
                    }) ?? [],
            };
        }) || []
    );
};
