import { Form, useLocation, useNavigate, useSubmit, useTransition } from '@remix-run/react';
import _ from 'lodash';
import React, { useRef } from 'react';
import { PriceRangeFilter } from './price-range-filter';

export const Filter: React.FC<{ priceRange: any }> = ({ priceRange }) => {
    const submit = useSubmit();
    const navigate = useNavigate();
    const location = useLocation();
    const formRef = useRef(null);
    const transition = useTransition();
    const price = priceRange.search.aggregations.price;
    function handleChange(event: any) {
        submit(event.currentTarget, { replace: true });
    }
    return (
        <div className="flex gap-5 mb-20">
            <Form method="get" onChange={handleChange} ref={formRef} className="flex gap-4">
                <label>
                    <select
                        name="orderBy"
                        // className="bg-grey py-2 px-4 hover:cursor-pointer w-60"
                        className="w-60 bg-grey py-2 px-6 rounded-md text-md font-bold "
                        defaultValue={'NAME_ASC'}
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
                <PriceRangeFilter min={price.min} max={price.max} formRef={formRef} />
            </Form>
            {transition.state === 'submitting' ? (
                <p>loading...</p>
            ) : (
                <button onClick={() => navigate(location.pathname)}>Remove all filters</button>
            )}
        </div>
    );
};
