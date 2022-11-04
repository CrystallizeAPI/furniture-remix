import { SearchByTopicsProductList } from '~/core/contracts/Product';
import mapAPIProductVariantToProductVariant from '../mapper/mapAPIProductVariantToProductVariant';

export default (data: any): SearchByTopicsProductList => {
    return {
        products:
            data?.search?.edges.map(({ node }: any) => {
                return {
                    id: node.id,
                    name: node.name,
                    path: node.path,
                    variant: mapAPIProductVariantToProductVariant(node.matchingVariant),
                    topics: node.topics.map((topic: any) => {
                        return {
                            name: topic.name,
                            path: topic.path,
                        };
                    }),
                };
            }) || [],
        topics:
            data?.topics?.aggregations?.topics.map((topic: any) => {
                return {
                    name: topic.name,
                    path: topic.path,
                };
            }) || [],
    };
};
