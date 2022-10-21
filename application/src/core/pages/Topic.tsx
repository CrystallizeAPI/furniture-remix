import { RequestContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { FilteredProducts } from '../components/filter/filtered-products';

export const fetchData = async (path: string, request: RequestContext, params: any): Promise<any> => {
    const { secret } = await getStoreFront(request.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: request.language,
        isPreview: request.isPreview,
    });
    const data = await api.searchByTopic(path);
    console.log(data);
    return {
        products: data?.search?.edges ?? [],
        topic: data?.topics?.aggregations?.topics?.find((item: any) => item.path === path),
    };
};

export default ({ data }: { data: any }) => {
    const { products, topic } = data;
    let topicName = topic?.name || topic?.path;
    return (
        <div className="container 2xl mx-auto px-6 mt-10">
            <h1 className="capitalize font-bold text-4xl">{topicName}</h1>
            <FilteredProducts products={products} />
        </div>
    );
};
