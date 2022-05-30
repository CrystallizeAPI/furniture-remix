import { ContentTransformer } from '@crystallize/reactjs-components';
import { json, LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { getSuperFast } from 'src/lib/superfast/SuperFast';
import { CategoryList } from '~/core/components/category-list';
import { FolderHero } from '~/core/components/folder-hero';
import { SuperFastHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { fetchFolder, fetchNavigation } from '~/core/UseCases';

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
        <div className="lg:w-content mx-auto w-full">
            <h1 className="font-bold text-2xl">{folder.name}</h1>
            <FolderHero component={hero} />
            <h2 className="mt-20 font-bold text-xl">Browse categories</h2>
            <div className="flex flex-wrap gap-4 mt-5 mb-20">
                {navigation?.tree?.children?.map((child: any) => (
                    <Link to={child?.path} prefetch="intent">
                        <div className="w-auto bg-grey py-2 px-6" key={child.name}>
                            {child.name}
                        </div>
                    </Link>
                ))}
            </div>
            <div>
                {navigation?.tree?.children?.map((child: any) => (
                    <div>
                        <div className="flex justify-between mt-10">
                            <div className="w-2/4 leading-[2.5em]">
                                <h2 className="font-bold text-xl mb-3">{child.name}</h2>
                                <ContentTransformer json={child?.description?.content?.json} />
                            </div>
                            <Link to={child.path} prefetch="intent" className="text-grey3 underline">
                                View all {child.name.toLowerCase()}
                            </Link>
                        </div>
                        <div className="flex gap-5">
                            <CategoryList category={child} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
