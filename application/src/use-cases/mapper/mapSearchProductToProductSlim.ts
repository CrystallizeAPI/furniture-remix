import { ProductSlim } from '~/core/contracts/Product';
import mapAPIProductVariantToProductVariant from './mapAPIProductVariantToProductVariant';

export default (data: any): ProductSlim[] => {
    return (
        data.map(({ node }: any) => {
            return {
                id: node.id,
                name: node.name,
                path: node.path,
                variant: mapAPIProductVariantToProductVariant(node.matchingVariant),
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
