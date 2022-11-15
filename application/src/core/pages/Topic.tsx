import { RequestContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { FilteredProducts } from '../components/filter/filtered-products';
import { SearchByTopicsProductList } from '../../use-cases/contracts/Product';
import { Topic } from '../../use-cases/contracts/Topic';

export const fetchData = async (
    path: string,
    request: RequestContext,
    params: any,
): Promise<SearchByTopicsProductList & { topic?: Topic }> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });

    const { products, topics } = await api.searchByTopic(path);
    const topic = topics.find((topic) => topic.path === path);
    return {
        products,
        topics,
        topic,
    };
};

export default ({ data }: { data: SearchByTopicsProductList & { topic?: Topic } }) => {
    const { products, topics, topic } = data;
    let topicName = topic?.name || topic?.path;
    return (
        <div className="container 2xl mx-auto px-6 mt-10">
            <h1 className="capitalize font-bold text-4xl">{topicName}</h1>
            <FilteredProducts products={products} />
        </div>
    );
};
