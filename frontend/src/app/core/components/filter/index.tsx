import { Form, useSearchParams, useSubmit } from '@remix-run/react';
import React, { ChangeEventHandler } from 'react';
import { PriceRangeFilter } from './price-range-filter';

export const Filter = ({ products, priceRange }: { products?: any; priceRange: any }) => {
    let submit = useSubmit();
    let [sort, setSort] = React.useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    console.log(priceRange);
    let price = priceRange.search.aggregations.price;

    let submitForm: ChangeEventHandler<HTMLSelectElement> = (event) => {
        submit((event.currentTarget || event.target).closest('form'));
        searchParams.set('orderBy', event.target.value);
        setSearchParams(searchParams);
    };

    return (
        <div className="flex gap-5 mb-5">
            <Form method="get">
                <label>
                    <select
                        onChange={(e) => submitForm(e)}
                        className="bg-grey py-2 px-4 hover:cursor-pointer w-60"
                        defaultValue={''}
                    >
                        <option disabled value="" className="text-textBlack">
                            Sort
                        </option>
                        <option value="PRICE_ASC">Price: Low to high</option>
                        <option value="PRICE_DESC">Price: High to low</option>
                        <option value="NAME_ASC">Name ascending</option>
                        <option value="NAME_DESC">Name descending</option>
                        <option value="STOCK_ASC">Stock ascending</option>
                        <option value="STOCK_DESC">Stock descending</option>
                    </select>
                </label>
            </Form>
            <PriceRangeFilter price={price} />
            <button onClick={() => setSearchParams('')}>Remove all filters</button>
        </div>
    );
};
