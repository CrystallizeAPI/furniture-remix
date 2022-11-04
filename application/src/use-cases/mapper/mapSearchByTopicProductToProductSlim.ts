import { SearchByTopicsProductList } from '~/core/contracts/Product';
import mapSearchProductToProductSlim from './mapSearchProductToProductSlim';

export default (data: any): SearchByTopicsProductList => {
    return {
        products: mapSearchProductToProductSlim(data.search.edges),
        topics:
            data?.topics?.aggregations?.topics.map((topic: any) => {
                return {
                    name: topic.name,
                    path: topic.path,
                };
            }) || [],
    };
};
