import { Form, useLocation, useTransition } from '@remix-run/react';
import { useRef } from 'react';
import { useAppContext } from '~/ui/app-context/provider';
import useSubmit from './useSubmit';
import useNavigate from './useNavigate';
import { PriceRangeFilter } from '~/ui/components/search/price-range-filter';
import { AttributeFilter } from '~/ui/components/search/attribute-filter';

export default ({ aggregations }: { aggregations: any }) => {
    const navigate = useNavigate();
    const submit = useSubmit();
    const location = useLocation();
    const transition = useTransition;
    const formRef = useRef(null);
    const { _t } = useAppContext();
    const price = aggregations?.search.aggregations.price;
    const attributes = aggregations?.search.aggregations.attributes;

    function handleChange(event: any) {
        submit(event.currentTarget, { replace: true });
    }

    const grouped = attributes?.reduce(
        (
            memo: Record<string, Array<{ attribute: string; value: string }>>,
            item: { attribute: string; value: string },
        ) => {
            if (!memo[item.attribute]) {
                memo[item.attribute] = [];
            }
            memo[item.attribute].push(item);
            return memo;
        },
        {},
    );

    return (
        <>
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
                            {_t('search.sort')}
                        </option>
                        <option value="PRICE_ASC">{_t('search.price.lowToHigh')}</option>
                        <option value="PRICE_DESC">{_t('search.price.highToLow')}</option>
                        <option value="NAME_ASC">{_t('search.name.ascending')}</option>
                        <option value="NAME_DESC">{_t('search.name.descending')}</option>
                        <option value="STOCK_ASC">{_t('search.stock.ascending')}</option>
                        <option value="STOCK_DESC">{_t('search.stock.descending')}</option>
                    </select>
                </label>
                <PriceRangeFilter min={price.min} max={price.max} formRef={formRef} />
                <AttributeFilter attributes={grouped} />
            </Form>
            {transition.state === 'submitting' ? (
                <p>{_t('loading')}...</p>
            ) : (
                <button onClick={() => navigate(location.pathname)}>{_t('search.removeAllFilters')}</button>
            )}
        </>
    );
};
