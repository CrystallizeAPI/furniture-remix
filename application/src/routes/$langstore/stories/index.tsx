import { HeadersFunction, json, LoaderFunction, MetaFunction } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/use-cases/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize/read';
import { buildMetas } from '~/use-cases/MicrodataBuilder';
import { getContext } from '~/use-cases/http/utils';
import { CategoryWithChildren } from '~/use-cases/contracts/Category';
import Stories from '~/ui/pages/Stories';
import { authenticatedUser } from '~/core/authentication.server';
import { marketIdentifiersForUser } from '~/use-cases/marketIdentifiersForUser';

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
    const user = await authenticatedUser(request);

    const folder = await api.fetchFolderWithChildren(path, marketIdentifiersForUser(user));
    return json({ folder }, StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', [path], shared.config.tenantIdentifier));
};

export default () => {
    const { folder } = useLoaderData() as { folder: CategoryWithChildren };
    return <Stories folder={folder} />;
};
