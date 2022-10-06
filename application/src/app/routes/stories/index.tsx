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
import { getHost, getLocale, isPreview } from '~/core-server/http-utils.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request }) => {
    const path = `/stories`;
    const { shared, secret } = await getStoreFront(getHost(request));
    const api = CrystallizeAPI(secret.apiClient, getLocale(request), isPreview(request));
    const folder = await api.fetchFolder(path);
    return json({ folder }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { folder } = useLoaderData();
    let title = folder.components.find((component: any) => component.id === 'title')?.content?.text;
    let intro = folder.components.find((component: any) => component.id === 'intro')?.content?.plainText;

    return (
        <div className="container 2xl md:px-6 mx-auto w-full p-10">
            <h1 className="text-6xl font-bold mt-10 mb-4">{title}</h1>
            <div className="flex gap-5">{intro}</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mt-10 grid-flow-row flex flex-wrap">
                {folder?.children.map((child: any) => (
                    <Document item={child} key={child.name} />
                ))}
            </div>
        </div>
    );
};
