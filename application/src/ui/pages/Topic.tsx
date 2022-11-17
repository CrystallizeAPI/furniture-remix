import { FilteredProducts } from '../components/search/filtered-products';
import { SearchByTopicsProductList } from '../../use-cases/contracts/Product';
import { Topic } from '../../use-cases/contracts/Topic';

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
