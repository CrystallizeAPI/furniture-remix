import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';
import { buildMetas } from '~/core/MicrodataBuilder';
import { Document } from '~/core/components/item/document';
import { getContext } from '~/core-server/http-utils.server';
import { CateogryWithChildren } from '~/core/contracts/Category';

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
    const { folder } = useLoaderData() as { folder: CateogryWithChildren };
    return (
        <div className="container 2xl md:px-6 mx-auto w-full p-10">
            <h1 className="text-6xl font-bold mt-10 mb-4">{folder.title}</h1>
            <div className="flex gap-5">{folder.description}</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10 grid-flow-row flex flex-wrap">
                {folder.children.map((child) => (
                    <Document item={child} key={child.name} />
                ))}
            </div>
        </div>
    );
};
