import { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return new Response(
        `User-agent: *\n${shared.config.identifier !== 'furniture' ? 'Disallow: ' : 'Allow: '}/\n`,
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['/robots.txt'], shared.config.tenantIdentifier),
    );
};
