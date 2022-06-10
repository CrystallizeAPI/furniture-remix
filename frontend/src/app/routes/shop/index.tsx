import { ContentTransformer } from '@crystallize/reactjs-components';
import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { CategoryList } from '~/core/components/category-list';
import { FolderHero } from '~/core/components/folder-hero';

import splideStyles from '@splidejs/splide/dist/css/themes/splide-default.min.css';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';

export function links() {
    return [{ rel: 'stylesheet', href: splideStyles }];
}

export let meta: MetaFunction = ({ data }: { data: any }) => {
    let metaData = data?.folder?.meta?.content?.chunks?.[0];
    let title = metaData?.find((meta: any) => meta.id === 'title')?.content?.text;
    let description = metaData?.find((meta: any) => meta.id === 'description')?.content?.plainText?.[0];
    let image = metaData?.find((meta: any) => meta.id === 'image')?.content?.firstImage?.url;
    let altDescription = data?.folder?.components?.find((comp: any) => comp.id === 'description')?.content
        ?.plainText?.[0];

    return {
        title: title || data?.folder?.name,
        'og:title': title || data?.folder?.name,
        description: description || altDescription,
        'og:description': description || altDescription,
        'og:image': image,
        'twitter:image': image,
        'twitter:card': 'summary_large_image',
        'twitter:description': description || altDescription,
    };
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

export default function ShopPage() {
    const { folder, navigation } = useLoaderData();
    const hero = folder.components.find((component: any) => component.id === 'hero-content')?.content
        ?.selectedComponent;
    return (
        <>
            <FolderHero component={hero} />
            <div className="2xl container mx-auto px-10">
                <div className="flex flex-wrap gap-4 pt-20 mb-10  items-center">
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
                        <div className="border-t border-[#dfdfdf] py-20" key={child.path}>
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
