import { Form, useLocation, useNavigate, useSubmit, useTransition } from '@remix-run/react';
import groupBy from 'lodash/groupBy';
import React, { useRef } from 'react';
import { AttributeFilter } from './attribute-filter';
import { PriceRangeFilter } from './price-range-filter';

export const Filter: React.FC<{ aggregations: any }> = ({ aggregations }) => {
    const submit = useSubmit();
    const navigate = useNavigate();
    const location = useLocation();
    const formRef = useRef(null);
    const transition = useTransition();
    const price = aggregations.search.aggregations.price;
    const attributes = aggregations.search.aggregations.attributes;

    function handleChange(event: any) {
        submit(event.currentTarget, { replace: true });
    }

    var grouped = groupBy(attributes, 'attribute');

    return (
        <div className="flex gap-5 mb-20 flex-wrap items-center justify-start">
            <Form
                method="get"
                action={location.pathname}
                onChange={handleChange}
                ref={formRef}
                className="flex gap-4 flex-wrap"
            >
                <label>
                    <select
                        name="orderBy"
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
                <AttributeFilter attributes={grouped} />
            </Form>
            {transition.state === 'submitting' ? (
                <p>loading...</p>
            ) : (
                <button onClick={() => navigate(location.pathname)}>Remove all filters</button>
            )}
        </div>
    );
};
