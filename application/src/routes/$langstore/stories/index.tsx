import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/core/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import { Document } from '~/ui/components/item/document';
import { getContext } from '~/use-cases/http/utils';
import { CategoryWithChildren } from '~/use-cases/contracts/Category';
import { Product } from '~/ui/components/item/product';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const path = `/stories`;
    const { shared, secret } = await getStoreFront(requestContext.host);
    const api = CrystallizeAPI({
        apiClient: secret.apiClient,
        language: requestContext.language,
        isPreview: requestContext.isPreview,
    });
    const folder = await api.fetchFolderWithChildren(path);
    return json({ folder }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { folder } = useLoaderData() as { folder: CategoryWithChildren };

    return (
        <div className="container 2xl md:px-6 mx-auto w-full p-10">
            <h1 className="text-6xl font-bold mt-10 mb-4">{folder.title}</h1>
            <div className="flex gap-5">{folder.description}</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10 grid-flow-row flex flex-wrap">
                {folder.children.map((child) => {
                    // kind of a hack here as know that ProductSlim does not have a type
                    if ('type' in child) {
                        return <Document item={child} key={child.name} />;
                    }
                    return <Product item={child} key={child.name} />;
                })}
            </div>
        </div>
    );
};
