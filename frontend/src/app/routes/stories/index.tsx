import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/core/Http-Cache-Tagger';
import { getStoreFront } from '~/core/storefront/storefront.server';
import { CrystallizeAPI } from '~/core/use-cases/crystallize';
import { buildMetas } from '~/core/MicrodataBuilder';
import { Document } from '~/core/components/item/document';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export let meta: MetaFunction = ({ data }) => {
    return buildMetas(data);
};

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const preview = url.searchParams.get('preview');
    const version = preview ? 'draft' : 'published';
    const path = `/stories`;
    const { shared, secret } = await getStoreFront(request.headers.get('Host')!);
    const folder = await CrystallizeAPI.fetchFolder(secret.apiClient, path, version);
    return json({ folder }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config));
};

export default () => {
    const { folder } = useLoaderData();
    let title = folder.components.find((component: any) => component.type === 'singleLine')?.content?.text;
    let description = folder.components.find((component: any) => component.type === 'richText')?.content?.plainText;
    return (
        <div className="container 2xl px-6 mx-auto w-full">
            <h1 className="text-6xl font-bold mt-10 mb-4">{title}</h1>
            <div className="flex gap-5">{description}</div>
            <div className="grid grid-cols-3 gap-3 mt-10 grid-flow-row ">
                {folder?.children.map((child: any) => (
                    <Document item={child} key={child.name} />
                ))}
            </div>
        </div>
    );
};
