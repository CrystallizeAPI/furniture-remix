import { SearchByTopicsProductList } from '../../contracts/Product';
import { DataMapper } from '..';

export default (data: any): SearchByTopicsProductList => {
    const mapper = DataMapper();
    return {
        products: mapper.API.Call.searchProductToProductSlim(data.search.edges),
        topics:
            data?.topics?.aggregations?.topics.map((topic: any) => {
                return {
                    name: topic.name,
                    path: topic.path,
                };
            }) || [],
    };
};
