import { ContentTransformer } from '@crystallize/reactjs-components';
import { HeadersFunction, json, LinksFunction, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { CategoryList } from '~/core/components/category-list';
import { Grid } from '~/core/components/grid-cells/grid';

import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/infrastructure/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { buildMetas } from '~/core/MicrodataBuilder';
import { getContext } from '~/use-cases/http/utils';
import { useAppContext } from '~/core/app-context/provider';
import { Shop } from '~/use-cases/contracts/Shop';

export const links: LinksFunction = () => {
    return [{ rel: 'stylesheet', href: splideStyles }];
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const path = '/shop';
    const { shared, secret } = await getStoreFront(requestContext.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
        isPreview: requestContext.isPreview,
    });
    const shop = await api.fetchShop(path);

    return json({ shop }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { shop } = useLoaderData() as { shop: Shop };
    const { path, _t } = useAppContext();

    return (
        <>
            {shop.hero && (
                <div className="w-full mt-4">
                    <Grid grid={shop.hero} />
                </div>
            )}
            <div className="2xl container mx-auto px-4 md:px-10">
                <div className="flex flex-wrap gap-4 pt-20 mb-10  items-center">
                    <h2 className="font-medium text-md text-md w-full block">{_t('browse')}</h2>
                    {shop.categories.map((category) => (
                        <Link
                            to={path(category.path)}
                            prefetch="intent"
                            className="w-auto bg-grey py-2 sm:px-6 px-4 rounded-md sm:text-lg text-md font-bold category-link"
                            key={category.name}
                        >
                            {category.name}
                        </Link>
                    ))}
                </div>
                <div>
                    {shop.categories.map((category) => (
                        <div className="border-t border-[#dfdfdf] py-20" key={category.path}>
                            <div className="flex  flex-col sm:flex-row sm:items-center justify-between ">
                                <div className="w-3/4 sm:w-2/4 leading-[1.5em]">
                                    <h2 className="font-bold text-2xl mb-3">{category.name}</h2>
                                    <ContentTransformer className="leading-1" json={category.description?.json} />
                                </div>
                                <Link
                                    to={path(category.path)}
                                    prefetch="intent"
                                    className="w-auto bg-grey py-2 px-6 text-center rounded-md text-md font-bold hover:bg-black hover:text-white mt-6 sm:mt-0"
                                    key={category.name}
                                >
                                    {_t('view')} {category.name.toLowerCase()}
                                </Link>
                            </div>
                            <CategoryList products={category.products} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
