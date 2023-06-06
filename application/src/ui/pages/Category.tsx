import { Filter } from '../components/search';
import { FilteredProducts } from '../components/search/filtered-products';
import { Grid } from '../components/grid/grid';
import { Category } from '../../use-cases/contracts/Category';
import { ProductSlim } from '../../use-cases/contracts/Product';

export default ({
    data,
}: {
    data: {
        category: Category;
        products: ProductSlim[];
        priceRangeAndAttributes: any;
    };
}) => {
    const { category, products, priceRangeAndAttributes } = data;

    return (
        <>
            <div className="container 2xl px-5 mx-auto w-full">
                <h1 className="text-3xl font-bold mt-10 mb-4">{category?.title}</h1>
                <p className="w-3/5 mb-10">{category?.description}</p>
            </div>
            {category?.hero && (
                <div className="w-full mx-auto">
                    <Grid grid={category?.hero} />
                </div>
            )}
            <div className={`container 2xl mt-2 px-5 mx-auto w-full ${category?.hero ? 'mt-20 pt-10' : ''}`}>
                <Filter aggregations={priceRangeAndAttributes} />
                <FilteredProducts products={products} />
            </div>
        </>
    );
};
