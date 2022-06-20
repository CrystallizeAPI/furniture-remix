import { ContentTransformer } from '@crystallize/reactjs-components';
import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { CategoryList } from '~/core/components/category-list';
import { Grid } from '~/core/components/grid-cells/grid';

import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { buildMetas } from '~/core/MicrodataBuilder';

export function links() {
    return [{ rel: 'stylesheet', href: splideStyles }];
}

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = '/shop';
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    const [folder, navigation] = await Promise.all([
        CrystallizeAPI.fetchFolder(secret.apiClient, path, version),
        CrystallizeAPI.fetchNavigation(secret.apiClient, path),
    ]);

    return json({ folder, navigation }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default () => {
    const { folder, navigation } = useLoaderData();
    const hero = folder.components.find((component: any) => component.id === 'hero-content')?.content
        ?.selectedComponent;
    let grid = hero?.content?.grids?.[0];

    return (
        <>
            {grid && (
                <div className="w-full">
                    <Grid grid={grid} />
                </div>
            )}
            <div className="2xl container mx-auto px-4 md:px-10">
                <div className="flex flex-wrap gap-4 pt-20 mb-10  items-center">
                    <h2 className="font-medium text-md text-md w-full block">Browse categories</h2>
                    {navigation?.tree?.children?.map((child: any) => (
                        <Link
                            to={child?.path}
                            prefetch="intent"
                            className="w-auto bg-grey py-2 sm:px-6 px-4 rounded-md sm:text-lg text-md font-bold"
                            key={child.name}
                        >
                            {child.name}
                        </Link>
                    ))}
                </div>
                <div>
                    {navigation?.tree?.children?.map((child: any) => (
                        <div className="border-t border-[#dfdfdf] py-20" key={child.path}>
                            <div className="flex  flex-col sm:flex-row sm:items-center justify-between ">
                                <div className="w-3/4 sm:w-2/4 leading-[1.5em]">
                                    <h2 className="font-bold text-2xl mb-3">{child.name}</h2>
                                    <ContentTransformer
                                        className="leading-1"
                                        json={child?.description?.content?.json}
                                    />
                                </div>

                                <Link
                                    to={child?.path}
                                    prefetch="intent"
                                    className="w-auto bg-grey py-2 px-6 text-center rounded-md text-md font-bold hover:bg-black hover:text-white mt-6 sm:mt-0"
                                    key={child.name}
                                >
                                    View all {child.name.toLowerCase()}
                                </Link>
                            </div>
                            <div className="grid md:grid-col-5 grid-flow-col gap-5 overflow-auto">
                                <CategoryList category={child} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
