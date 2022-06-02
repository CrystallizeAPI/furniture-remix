import { ContentTransformer } from '@crystallize/reactjs-components';
import { json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { CategoryList } from '~/core/components/category-list';
import { FolderHero } from '~/core/components/folder-hero';
import { SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { fetchFolder, fetchNavigation } from '~/core/UseCases';

import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';

export function links() {
    return [{ rel: 'stylesheet', href: splideStyles }];
}

export let meta: MetaFunction = ({ data }: { data: any }) => {
    let metaData = data?.folder?.meta?.content?.chunks?.[0];

    return {
        title: `${metaData?.[0]?.content?.text}`,
        description: `${metaData?.[1]?.content?.plainText}`,
        'og:image': `${metaData?.[2]?.content?.firstImage?.url}`,
    };
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = '/shop';
    const superFast = await getSuperFast(request.headers.get('Host')!);
    const folder = await fetchFolder(superFast.apiClient, path, version);
    const navigation = await fetchNavigation(superFast.apiClient);

    return json({ folder, navigation }, SuperFastHttpCacheHeaderTagger('30s', '30s', [path], superFast.config));
};

export default function ShopPage() {
    const { folder, navigation } = useLoaderData();
    const hero = folder.components.find((component: any) => component.id === 'hero-content')?.content
        ?.selectedComponent;

    return (
        <>
            <FolderHero component={hero} />
            <div className="2xl  container mx-auto ">
                {/* <h1 className="font-bold text-2xl">{folder.name}</h1> */}
                <div className="flex flex-wrap gap-4 mt-20 pt-20 mb-20  items-center">
                    <h2 className="font-medium text-md text-md w-full block">Browse categories</h2>
                    {navigation?.tree?.children?.map((child: any) => (
                        <Link
                            to={child?.path}
                            prefetch="intent"
                            className="w-auto bg-grey py-2 px-6 rounded-md text-lg font-bold"
                            key={child.name}
                        >
                            {child.name}
                        </Link>
                    ))}
                </div>
                <div>
                    {navigation?.tree?.children?.map((child: any) => (
                        <div className="border-t border-[#dfdfdf] py-20">
                            <div className="flex items-center justify-between ">
                                <div className="w-2/4 leading-[1.5em]">
                                    <h2 className="font-bold text-2xl mb-3">{child.name}</h2>
                                    <ContentTransformer
                                        className="leading-1"
                                        json={child?.description?.content?.json}
                                    />
                                </div>

                                <Link
                                    to={child?.path}
                                    prefetch="intent"
                                    className="w-auto bg-grey py-2 px-6 rounded-md text-md font-bold hover:bg-black hover:text-white"
                                    key={child.name}
                                >
                                    View all {child.name.toLowerCase()}
                                </Link>
                            </div>
                            <div className="grid grid-col-5 gap-5">
                                <CategoryList category={child} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
